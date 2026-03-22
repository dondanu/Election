package com.election.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "district")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class District {

    @Id
    @Column(name = "district_id")
    private int districtId;

    @Column(name = "district_name", length = 40)
    private String districtName;

    @ManyToOne
    @JoinColumn(name = "province_id", referencedColumnName = "province_id")
    private Province province;
}
