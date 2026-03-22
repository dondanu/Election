package com.election.project.controller;

import com.election.project.dto.ProvinceDTO;
import com.election.project.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provinces")
@CrossOrigin("*")
public class ProvinceController {

    @Autowired
    private ProvinceService provinceService;

    @PostMapping
    public ProvinceDTO createProvince(@RequestBody ProvinceDTO dto) {
        return provinceService.saveProvince(dto);
    }

    @GetMapping
    public List<ProvinceDTO> getAllProvinces() {
        return provinceService.getAllProvinces();
    }

    @GetMapping("/{id}")
    public ProvinceDTO getProvinceById(@PathVariable int id) {
        return provinceService.getProvinceById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteProvince(@PathVariable int id) {
        provinceService.deleteProvince(id);
    }
}
