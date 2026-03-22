package com.election.project.service;

import com.election.project.dto.ProvinceDTO;
import java.util.List;

public interface ProvinceService {
    ProvinceDTO saveProvince(ProvinceDTO provinceDTO);
    List<ProvinceDTO> getAllProvinces();
    ProvinceDTO getProvinceById(int id);
    ProvinceDTO updateProvince(ProvinceDTO provinceDTO);
    void deleteProvince(int id);
}
