package com.election.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "party")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Party {

    @Id
    @Column(name = "party_id")
    private int partyId;

    @Column(name = "party_name", length = 40)
    private String partyName;

    @ManyToOne
    @JoinColumn(name = "election_id", referencedColumnName = "election_id")
    private Election election;
}
