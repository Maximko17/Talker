package com.talker.talker.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice
@RestController
public class CustomResponseEntityExceptionHandler {

    @ExceptionHandler(BlockedUserEx.class)
    public ResponseEntity<?> blockedUserMessage(BlockedUserEx ex){
        BlockedUserExResponse response = new BlockedUserExResponse(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(BadRequestEx.class)
    public ResponseEntity<?> badRequestMessage(BadRequestEx ex){
        BadRequestEx response = new BadRequestEx(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
