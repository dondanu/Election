package com.election.project.service;

import com.election.project.dto.DistrictDTO;
import com.election.project.entity.District;
import com.election.project.entity.Province;
import com.election.project.repository.DistrictRepository;
import com.election.project.repository.ProvinceRepository;
import com.election.project.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DistrictServiceImpl implements DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    private DistrictDTO mapToDTO(District district) {
        return new DistrictDTO(
                district.getDistrictId(),
                district.getDistrictName(),
                district.getProvince().getProvinceId()
        );
    }

    private District mapToEntity(DistrictDTO dto) {
        Province province = provinceRepository.findById(dto.getProvinceId()).orElse(null);
        return new District(
                dto.getDistrictId(),
                dto.getDistrictName(),
                province
        );
    }

    @Override
    public DistrictDTO saveDistrict(DistrictDTO dto) {
        District saved = districtRepository.save(mapToEntity(dto));
        return mapToDTO(saved);
    }

    @Override
    public List<DistrictDTO> getAllDistricts() {
        return districtRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DistrictDTO getDistrictById(int id) {
        return districtRepository.findById(id).map(this::mapToDTO).orElse(null);
    }

    @Override
    public void deleteDistrict(int id) {
        districtRepository.deleteById(id);
    }
}
