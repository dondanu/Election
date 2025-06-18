package com.election.project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "province")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Province {

    @Id
    @Column(name = "province_id")
    private int provinceId;

    @Column(name = "province_name", length = 40)
    private String provinceName;

    @Column(name = "no_of_districts")
    private int noOfDistricts;

    @OneToMany(mappedBy = "province", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<District> districts;

    public Province(int provinceId, String provinceName, int noOfDistricts) {
        this.provinceId = provinceId;
        this.provinceName = provinceName;
        this.noOfDistricts = noOfDistricts;
    }
}
