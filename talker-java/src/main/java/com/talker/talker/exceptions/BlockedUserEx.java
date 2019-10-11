package com.talker.talker.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class BlockedUserEx extends RuntimeException{
    public BlockedUserEx(String message) {
        super(message);
    }
}
