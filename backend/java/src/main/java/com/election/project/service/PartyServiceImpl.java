package com.election.project.service;

import com.election.project.dto.PartyDTO;
import com.election.project.entity.Party;
import com.election.project.repository.PartyRepository;
import com.election.project.service.PartyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartyServiceImpl implements PartyService {

    @Autowired
    private PartyRepository partyRepository;

    private PartyDTO mapToDTO(Party party) {
        PartyDTO dto = new PartyDTO();
        dto.setId(party.getPartyId());
        dto.setName(party.getPartyName());
        return dto;
    }

    private Party mapToEntity(PartyDTO dto) {
        Party party = new Party();
        party.setPartyId(dto.getId());
        party.setPartyName(dto.getName());
        return party;
    }

    @Override
    public PartyDTO saveParty(PartyDTO dto) {
        Party saved = partyRepository.save(mapToEntity(dto));
        return mapToDTO(saved);
    }

    @Override
    public List<PartyDTO> getAllParties() {
        return partyRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public PartyDTO getPartyById(int id) {
        return partyRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    @Override
    public void deleteParty(int id) {
        partyRepository.deleteById(id);
    }
}
