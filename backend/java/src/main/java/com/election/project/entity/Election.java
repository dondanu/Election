package com.election.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "election")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Election {

    @Id
    @Column(name = "election_id")
    private int electionId;

    @Column(name = "election_year")
    private int electionYear;
}
