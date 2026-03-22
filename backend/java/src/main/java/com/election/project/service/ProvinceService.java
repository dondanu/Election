package com.election.project.service;

import com.election.project.dto.ProvinceDTO;
import java.util.List;

public interface ProvinceService {
    ProvinceDTO saveProvince(ProvinceDTO provinceDTO);
    List<ProvinceDTO> getAllProvinces();
    ProvinceDTO getProvinceById(int id);
    void deleteProvince(int id);
}
