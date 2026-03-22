package com.election.project.service;

import com.election.project.dto.PartyDTO;

import java.util.List;

public interface PartyService {
    PartyDTO saveParty(PartyDTO dto);
    List<PartyDTO> getAllParties();
    PartyDTO getPartyById(int id);
    void deleteParty(int id);
}
