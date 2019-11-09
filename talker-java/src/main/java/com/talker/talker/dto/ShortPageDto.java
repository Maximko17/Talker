package com.talker.talker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ShortPageDto<T> {

    private T content;
    private int currentSize;
    private long totalElements;

}
