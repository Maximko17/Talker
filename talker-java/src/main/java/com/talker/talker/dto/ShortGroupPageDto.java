package com.talker.talker.dto;

import com.talker.talker.domain.Groups;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShortGroupPageDto{

    private Set<Groups> content;
    private int currentSize;
    private long totalElements;
}
