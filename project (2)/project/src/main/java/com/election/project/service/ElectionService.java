package com.election.project.service;

import com.election.project.dto.ElectionDTO;

import java.util.List;

public interface ElectionService {
    ElectionDTO saveElection(ElectionDTO dto);
    List<ElectionDTO> getAllElections();
    ElectionDTO getElectionById(int id);
    void deleteElection(int id);
}
