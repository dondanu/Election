package com.election.project.service;

import com.election.project.dto.ElectionDTO;
import com.election.project.entity.Election;
import com.election.project.repository.ElectionRepository;
import com.election.project.service.ElectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElectionServiceImpl implements ElectionService {

    @Autowired
    private ElectionRepository electionRepository;

    private ElectionDTO mapToDTO(Election election) {
        return new ElectionDTO(election.getElectionId(), election.getElectionYear());
    }

    private Election mapToEntity(ElectionDTO dto) {
        return new Election(dto.getElectionId(), dto.getElectionYear());
    }

    @Override
    public ElectionDTO saveElection(ElectionDTO dto) {
        Election saved = electionRepository.save(mapToEntity(dto));
        return mapToDTO(saved);
    }

    @Override
    public List<ElectionDTO> getAllElections() {
        return electionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ElectionDTO getElectionById(int id) {
        return electionRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    @Override
    public void deleteElection(int id) {
        electionRepository.deleteById(id);
    }
}
