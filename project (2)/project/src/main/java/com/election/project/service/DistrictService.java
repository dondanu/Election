package com.election.project.service;

import com.election.project.dto.DistrictDTO;

import java.util.List;

public interface DistrictService {
    DistrictDTO saveDistrict(DistrictDTO dto);
    List<DistrictDTO> getAllDistricts();
    DistrictDTO getDistrictById(int id);
    void deleteDistrict(int id);
}
