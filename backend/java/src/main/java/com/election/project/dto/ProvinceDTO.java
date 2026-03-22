package com.election.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProvinceDTO {
    @JsonProperty("id")
    private int provinceId;
    
    @JsonProperty("name")
    private String provinceName;
    
    @JsonProperty("districtCount")
    private int noOfDistricts;
    
    // Additional setter for controller compatibility
    public void setId(int id) {
        this.provinceId = id;
    }
    
    public int getId() {
        return this.provinceId;
    }
}
