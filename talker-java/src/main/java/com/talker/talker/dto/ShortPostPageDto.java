package com.talker.talker.dto;
import com.fasterxml.jackson.annotation.JsonView;
import com.talker.talker.domain.Views;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@JsonView(Views.ShortPost.class)
@AllArgsConstructor
@NoArgsConstructor
public class ShortPostPageDto<T>{
    private T content;
    private int currentSize;
    private long totalElements;

}
