package com.election.project.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DistrictDTO {
    private int id;
    private String name;
    private int provinceId;
}
