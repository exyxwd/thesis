package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.dto.mapper.WasteMapper;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import hu.exyxwd.tisztatisza.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/wastes")
public class WasteController {

    @Autowired
    private WasteRepository wasteRepository;

    @Autowired
    private WasteMapper wasteMapper;

    // get waste by id rest api
    @GetMapping("/{id}")
    public ResponseEntity<DetailedWasteDTO> getWasteById(@PathVariable Long id) {
        Waste waste = wasteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waste does not exist with id: " + id));
        return ResponseEntity.ok(wasteMapper.toDetailedWasteDTO(waste));
    }

    // get wastes by ids rest api
    @PostMapping("/filteredWastes")
    public List<DetailedWasteDTO> getWastesByIds(@RequestBody Map<String, List<Long>> requestData) {
        List<Long> ids = requestData.get("ids");
        List<Waste> wastes = wasteRepository.findAllById(ids);
        if (wastes.size() != ids.size()) {
            throw new ResourceNotFoundException("Some wastes do not exist with the given ids");
        }
        return wastes.stream().map(wasteMapper::toDetailedWasteDTO).collect(Collectors.toList());
    }

    @Cacheable(value = "filteredMapData")
    @GetMapping("/mapDataFiltered")
    public List<MapDataDTO> getFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
        return wastes.stream()
                .map(wasteMapper::toMapData)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "inverseFilteredMapData")
    @GetMapping("/mapDataFilteredInverse")
    public List<MapDataDTO> getInverseFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
        return wastes.stream()
                .map(wasteMapper::toMapData)
                .collect(Collectors.toList());
    }
}
