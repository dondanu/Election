package com.election.project.controller;

import com.election.project.dto.ElectionDTO;
import com.election.project.service.ElectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@CrossOrigin("*")
public class ElectionController {

    @Autowired
    private ElectionService electionService;

    @PostMapping
    public ElectionDTO createElection(@RequestBody ElectionDTO dto) {
        return electionService.saveElection(dto);
    }

    @GetMapping
    public List<ElectionDTO> getAllElections() {
        return electionService.getAllElections();
    }

    @GetMapping("/{id}")
    public ElectionDTO getElectionById(@PathVariable int id) {
        return electionService.getElectionById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteElection(@PathVariable int id) {
        electionService.deleteElection(id);
    }
}
