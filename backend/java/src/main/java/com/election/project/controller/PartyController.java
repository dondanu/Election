package com.election.project.controller;

import com.election.project.dto.PartyDTO;
import com.election.project.service.PartyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
@CrossOrigin("*")
public class PartyController {

    @Autowired
    private PartyService partyService;

    @PostMapping
    public PartyDTO createParty(@RequestBody PartyDTO dto) {
        return partyService.saveParty(dto);
    }

    @GetMapping
    public List<PartyDTO> getAllParties() {
        return partyService.getAllParties();
    }

    @GetMapping("/{id}")
    public PartyDTO getPartyById(@PathVariable int id) {
        return partyService.getPartyById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteParty(@PathVariable int id) {
        partyService.deleteParty(id);
    }
}
