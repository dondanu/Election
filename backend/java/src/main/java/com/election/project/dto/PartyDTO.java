package com.election.project.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PartyDTO {
    private int partyId;
    private String partyName;
    private int electionId;
}
