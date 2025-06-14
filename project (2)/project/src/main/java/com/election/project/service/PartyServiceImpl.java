package com.election.project.service;

import com.election.project.dto.PartyDTO;
import com.election.project.entity.Election;
import com.election.project.entity.Party;
import com.election.project.repository.ElectionRepository;
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

    @Autowired
    private ElectionRepository electionRepository;

    private PartyDTO mapToDTO(Party party) {
        return new PartyDTO(party.getPartyId(), party.getPartyName(), party.getElection().getElectionId());
    }

    private Party mapToEntity(PartyDTO dto) {
        Election election = electionRepository.findById(dto.getElectionId()).orElse(null);
        return new Party(dto.getPartyId(), dto.getPartyName(), election);
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
