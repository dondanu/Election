package com.election.project.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProvinceDTO {
    private int provinceId;
    private String provinceName;
    private int noOfDistricts;
}
