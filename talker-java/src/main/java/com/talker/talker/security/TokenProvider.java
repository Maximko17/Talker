package com.talker.talker.security;

import com.talker.talker.domain.User;
import com.talker.talker.service.UserService;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static com.talker.talker.security.SecurityConstans.EXPIRATION_TIME;
import static com.talker.talker.security.SecurityConstans.SECRET;

@Service
public class TokenProvider {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    public String generateAccessToken(Authentication authentication){
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Map attribures = userPrincipal.getAttributes();
        String email = (String) attribures.get("email");
        User user = userService.getUserByEmail(email);
        Date now = new Date(System.currentTimeMillis());

        Date exprTime = new Date(now.getTime() + EXPIRATION_TIME);

        Integer userId = user.getId();

        Map<String,Object> claims = new HashMap<>();
        claims.put("id",userId);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(exprTime)
                .signWith(SignatureAlgorithm.HS256,SECRET)
                .compact();
    }

    public String generateRefreshToken(Authentication authentication,User loggedUser){
        User user;
        if (authentication != null){
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map attribures = oAuth2User.getAttributes();
            String email = (String) attribures.get("email");
            user = userService.getUserByEmail(email);
        }else{
            user = loggedUser;
        }
        Date now = new Date(System.currentTimeMillis());

        Date exprTime = new Date(now.getTime() + EXPIRATION_TIME);

        Integer userId = user.getId();

        Map<String,Object> claims = new HashMap<>();
        claims.put("id",userId);
        claims.put("email",user.getEmail());
        claims.put("name", user.getName());
        claims.put("photo",user.getPhoto());

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(exprTime)
                .signWith(SignatureAlgorithm.HS256,SECRET)
                .compact();
    }

    //Validate Token
    public boolean validateToken(String token){
        try {
            Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token);
            return true;
        }catch (SignatureException ex){
            System.out.println("INVALID JWT SIGNATURE");
        }catch (MalformedJwtException ex){
            System.out.println("INVALID JWT TOKEN");
        }catch (ExpiredJwtException ex){
            System.out.println("EXPIRED JWT TOKEN");
        }catch (UnsupportedJwtException ex){
            System.out.println("UNSUPPORTED JWT TOKEN");
        }catch (IllegalArgumentException ex){
            System.out.println("JWT CLAIMS STRING IS EMPTY");
        }
        return false;
    }

    //Get User Id
    public Integer getUserIdFromJWT(String token){
        Claims claims = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody();

        return (Integer)claims.get("id");
    }

}
