package com.talker.talker.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.Views;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonView(Views.ShortResponse.class)
@AllArgsConstructor
public class ShortResponsePageDto {
    private List<?> content;
    private int currentSize;
    private long totalElements;
}
