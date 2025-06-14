package com.election.project.controller;

import com.election.project.dto.DistrictDTO;
import com.election.project.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
@CrossOrigin("*")
public class DistrictController {

    @Autowired
    private DistrictService districtService;

    @PostMapping
    public DistrictDTO createDistrict(@RequestBody DistrictDTO dto) {
        return districtService.saveDistrict(dto);
    }

    @GetMapping
    public List<DistrictDTO> getAllDistricts() {
        return districtService.getAllDistricts();
    }

    @GetMapping("/{id}")
    public DistrictDTO getDistrictById(@PathVariable int id) {
        return districtService.getDistrictById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDistrict(@PathVariable int id) {
        districtService.deleteDistrict(id);
    }
}
