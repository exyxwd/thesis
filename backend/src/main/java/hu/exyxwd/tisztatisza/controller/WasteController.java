package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.dto.mapper.WasteMapper;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import lombok.AllArgsConstructor;
import hu.exyxwd.tisztatisza.exception.ResourceNotFoundException;

// TODO: years ago to config, response entities
@RestController
@AllArgsConstructor
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

    @GetMapping("/mapDataFiltered")
    public ResponseEntity<List<MapDataDTO>> getFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
        List<MapDataDTO> mapData = wastes.stream()
                .map(wasteMapper::toMapData)
                .collect(Collectors.toList());

        return new ResponseEntity<>(mapData, HttpStatus.OK);
    }

    @GetMapping("/mapDataFilteredInverse")
    public ResponseEntity<List<MapDataDTO>> getInverseFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
        List<MapDataDTO> mapData = wastes.stream()
                .map(wasteMapper::toMapData)
                .collect(Collectors.toList());

        return new ResponseEntity<>(mapData, HttpStatus.OK);
    }

    // set hidden field of a waste by id rest api
    @PutMapping("/{id}/hidden")
    public ResponseEntity<?> setHidden(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Waste waste = wasteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waste does not exist with id: " + id));
        waste.setHidden(body.get("hidden"));
        wasteRepository.save(waste);

        return ResponseEntity.ok().build();
    }

    // get all hidden wastes rest api
    @GetMapping("/hidden")
    public List<DetailedWasteDTO> getHiddenWastes() {
        List<Waste> wastes = wasteRepository.findByHidden(true);
        return wastes.stream()
                .map(wasteMapper::toDetailedWasteDTO)
                .collect(Collectors.toList());
    }
}