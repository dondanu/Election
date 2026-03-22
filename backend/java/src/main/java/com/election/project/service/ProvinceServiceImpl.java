package com.election.project.service;

import com.election.project.dto.ProvinceDTO;
import com.election.project.entity.Province;
import com.election.project.repository.ProvinceRepository;
import com.election.project.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProvinceServiceImpl implements ProvinceService {

    @Autowired
    private ProvinceRepository provinceRepository;

    private ProvinceDTO mapToDTO(Province province) {
        ProvinceDTO dto = new ProvinceDTO();
        dto.setId(province.getProvinceId());
        dto.setName(province.getProvinceName());
        dto.setDistrictCount(province.getNoOfDistricts());
        return dto;
    }

    private Province mapToEntity(ProvinceDTO dto) {
        Province province = new Province();
        province.setProvinceId(dto.getId());
        province.setProvinceName(dto.getName());
        province.setNoOfDistricts(dto.getDistrictCount());
        return province;
    }

    @Override
    public ProvinceDTO saveProvince(ProvinceDTO dto) {
        Province saved = provinceRepository.save(mapToEntity(dto));
        return mapToDTO(saved);
    }

    @Override
    public List<ProvinceDTO> getAllProvinces() {
        return provinceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProvinceDTO getProvinceById(int id) {
        return provinceRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    @Override
    public ProvinceDTO updateProvince(ProvinceDTO dto) {
        Province updated = provinceRepository.save(mapToEntity(dto));
        return mapToDTO(updated);
    }

    @Override
    public void deleteProvince(int id) {
        provinceRepository.deleteById(id);
    }
}
