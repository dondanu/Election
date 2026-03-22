package com.election.project.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DistrictDTO {
    private int districtId;
    private String districtName;
    private int provinceId;
}
