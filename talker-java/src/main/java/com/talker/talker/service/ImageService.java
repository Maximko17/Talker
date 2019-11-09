package com.talker.talker.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.talker.talker.domain.ChatFiles;
import com.talker.talker.domain.ChatMessage;
import com.talker.talker.domain.PostImages;
import com.talker.talker.domain.Posts;
import com.talker.talker.repository.ChatFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
public class ImageService {

    @Value("${upload.path}")
    private String uploadPath;

    private static final String AMAZON_S3_BUCKET_URL = "https://talker-basket.s3.us-east-2.amazonaws.com";

    private final PostImagesService postImagesService;
    private final ChatFileRepository chatFileRepository;
    private final Executor processExecutor;

    public ImageService(PostImagesService postImagesService, ChatFileRepository chatFileRepository, Executor processExecutor) {
        this.postImagesService = postImagesService;
        this.chatFileRepository = chatFileRepository;
        this.processExecutor = processExecutor;
    }

    public String saveUserImage(MultipartFile photo) {
        String UUIDFile = java.util.UUID.randomUUID().toString();
        String resultFilename = UUIDFile + "." + photo.getOriginalFilename();

        saveFile(photo, uploadPath + "/users/" + resultFilename, "users/" + resultFilename);

        return AMAZON_S3_BUCKET_URL + "/users/" + resultFilename;
    }

    public String savePostPreviewImage(MultipartFile preview_image) {
        if (preview_image != null) {
            String UUIDFile = java.util.UUID.randomUUID().toString();
            String resultFilename = UUIDFile + "." + preview_image.getOriginalFilename();

            processExecutor.execute(() -> saveFile(preview_image, uploadPath + "/posts/" + resultFilename, "posts/" + resultFilename));

            return resultFilename;
        }
        return null;
    }

    public List<PostImages> savePostImages(MultipartFile[] images, Posts post) {
        if (images.length != 0) {
            ArrayList<PostImages> postImages = new ArrayList<>();
            for (MultipartFile image : images) {
                String UUIDFile = java.util.UUID.randomUUID().toString();
                String resultFilename = UUIDFile + "." + image.getOriginalFilename();

                processExecutor.execute(() -> saveFile(image, uploadPath + "/posts/" + resultFilename, "posts/" + resultFilename));

                PostImages postImage = new PostImages();
                postImage.setName(AMAZON_S3_BUCKET_URL + "/posts/" + resultFilename);
                postImage.setPost(post);
                postImagesService.saveImage(postImage);
            }
            return postImages;

        }
        return null;
    }


    public void savePreviousMessagesFiles(List<ChatFiles> files, ChatMessage editMessage) {
        chatFileRepository.deleteAllByMessage(editMessage);
        files.forEach(file->file.setMessage(editMessage));
        chatFileRepository.saveAll(files);
    }

    public void saveMessageFiles(MultipartFile[] files, ChatMessage message) {
        if (files.length != 0) {
            for (MultipartFile file : files) {
                String UUIDFile = java.util.UUID.randomUUID().toString();
                String resultFilename = UUIDFile + file.getOriginalFilename();

                saveFile(file, uploadPath + "/messages/" + resultFilename, "messages/" + resultFilename);

                ChatFiles newFile = new ChatFiles();
                newFile.setFileName(AMAZON_S3_BUCKET_URL + "/messages/" + resultFilename);
                newFile.setFileType(getFileType(file.getContentType()));
                newFile.setFileSize(file.getSize());
                newFile.setMessage(message);
                chatFileRepository.save(newFile);
            }
        }
    }

    public String saveGroupImage(MultipartFile image) {
        if (image != null) {
            String UUIDFile = java.util.UUID.randomUUID().toString();
            String resultFilename = UUIDFile + "." + image.getOriginalFilename();

            processExecutor.execute(() -> saveFile(image, uploadPath + "/groups/" + resultFilename, "groups/" + resultFilename));

            return AMAZON_S3_BUCKET_URL + "/groups/" + resultFilename;
        }else{
            return AMAZON_S3_BUCKET_URL + "/groups/default-image.jpg";
        }
    }

    public String saveBannerImage(MultipartFile image) {
        if (image != null) {
            String UUIDFile = java.util.UUID.randomUUID().toString();
            String resultFilename = UUIDFile + "." + image.getOriginalFilename();

            processExecutor.execute(() -> saveFile(image, uploadPath + "/groups/" + resultFilename, "groups/" + resultFilename));

            return AMAZON_S3_BUCKET_URL + "/groups/" + resultFilename;
        }
        return null;
    }

    private String getFileType(String file){
        if (file.equals("image/png") || file.equals("image/jpg") || file.equals("image/jpeg")){
            return "image";
        }
        return "file";
    }

    private void saveFile(MultipartFile file, String localPath, String AWSPath) {
        try {
            file.transferTo(new File(localPath));
            putObjectIn_AWS_S3(get_AWS_S3_Client(), AWSPath);

            deleteLocalFile(localPath);
        } catch (IOException ex) {
            System.out.println(ex);
        }
    }

    private void deleteLocalFile(String path) {
        File imageFile = new File(path);
        if (imageFile.delete()) {
            System.out.println("Удалено успешно");
        } else {
            System.out.println("Не удалось удалить");
        }
    }

    private AmazonS3 get_AWS_S3_Client() {
        AWSCredentials credentials = new BasicAWSCredentials(
                "AKIAJTR4M5VMWDCMSASQ",
                "XAZe0Fu5gL3Bk0IAdGzvBZdvyOIIc+vxJmeiBlRs"
        );
        return AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.US_EAST_2)
                .build();
    }

    public ResponseEntity<byte[]> downloadObjectFrom_AWS_S3(String key) throws IOException {
        S3Object s3Object = get_AWS_S3_Client().getObject(
                "talker-basket",
                "messages/"+key
        );
        S3ObjectInputStream objectInputStream = s3Object.getObjectContent();

        byte[] bytes = IOUtils.toByteArray(objectInputStream);

        String fileName = URLEncoder.encode(key, "UTF-8").replaceAll("\\+", "%20");

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        httpHeaders.setContentLength(bytes.length);
        httpHeaders.setContentDispositionFormData("attachment", fileName);
        System.out.println("download");

        return new ResponseEntity<>(bytes,httpHeaders, HttpStatus.OK);
    }

    private void putObjectIn_AWS_S3(AmazonS3 s3client, String pathName) {
        s3client.putObject(
                "talker-basket",
                pathName,
                new File(uploadPath + "/" + pathName)
        );
        System.out.println("Put");
    }

    private void deleteObjectIn_AWS_S3(AmazonS3 s3client, String pathName) {
        s3client.deleteObject(
                "talker-basket",
                pathName
        );
    }

}
