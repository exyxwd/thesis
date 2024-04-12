package hu.exyxwd.tisztatisza.controller;

import java.util.Map;
import java.util.Set;
import java.util.List;
import java.util.HashMap;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;


import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.dto.MapDataDTO;
import hu.exyxwd.tisztatisza.dto.mapper.WasteMapper;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import hu.exyxwd.tisztatisza.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/")
public class WasteController {

    @Autowired
    private WasteRepository wasteRepository;

    @Autowired
    private WasteMapper wasteMapper;

    // get all wastes
    @GetMapping("/wastes")
    public List<Waste> getAllWastes() {
        return wasteRepository.findAll();
    }

    // create waste rest api
    @PostMapping("/wastes")
    public Waste createWaste(@RequestBody Waste waste) {
        return wasteRepository.save(waste);
    }

    // Create multiple wastes rest api
    @PostMapping("/wastes/bulk")
    public List<Waste> createWastes(@RequestBody List<Waste> wastes) {
        return wasteRepository.saveAll(wastes);
    }

    // get waste by id rest api
    @GetMapping("/wastes/{id}")
    public ResponseEntity<Waste> getwasteById(@PathVariable Long id) {
        Waste waste = wasteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waste does not exist with id: " + id));
        return ResponseEntity.ok(waste);
    }

    // get wastes by ids rest api
    @PostMapping("/wastes/filteredWastes")
    public List<Waste> getWastesByIds(@RequestBody Map<String, List<Long>> requestData) {
        List<Long> ids = requestData.get("ids");
        List<Waste> wastes = wasteRepository.findAllById(ids);
        if (wastes.size() != ids.size()) {
            throw new ResourceNotFoundException("Some wastes do not exist with the given ids");
        }
        return wastes;
    }

    // update waste rest api
    // @PutMapping("/wastes/{id}")
    // public ResponseEntity<Waste> updatewaste(@PathVariable Long id, @RequestBody
    // Waste wasteDetails) {
    // Waste waste = wasteRepository.findById(id)
    // .orElseThrow(() -> new ResourceNotFoundException("Waste does not exist with
    // id: " + id));

    // waste.setLatitude(wasteDetails.getLatitude());
    // waste.setLongitude(wasteDetails.getLongitude());
    // waste.setLocality(wasteDetails.getLocality());
    // waste.setCountry(wasteDetails.getCountry());

    // Waste updatedwaste = wasteRepository.save(waste);
    // return ResponseEntity.ok(updatedwaste);
    // }

    // delete waste rest api
    @DeleteMapping("/wastes/{id}")
    public ResponseEntity<Map<String, Boolean>> deletewaste(@PathVariable Long id) {
        Waste waste = wasteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waste does not exist with id: " + id));

        wasteRepository.delete(waste);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/wastes/mapData")
    public List<Object> getWastesWithSelectedFields() {
        return wasteRepository.findAll().stream().map(waste -> new Object() {
            public Long id = waste.getId();
            public BigDecimal latitude = waste.getLatitude();
            public BigDecimal longitude = waste.getLongitude();
            public Waste.WasteCountry country = waste.getCountry();
            public Waste.WasteSize size = waste.getSize();
            public Waste.WasteStatus status = waste.getStatus();
            public Set<Waste.WasteType> types = waste.getTypes();
            public Set<String> rivers = waste.getRivers();
            public LocalDateTime updateTime = waste.getUpdateTime();
        }).collect(Collectors.toList());
    }

    @GetMapping("/wastes/mapDataFiltered")
    public List<MapDataDTO> getFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
        return wastes.stream()
                .map(wasteMapper::toMapData)
                .collect(Collectors.toList());
    }

    @GetMapping("/wastes/mapDataFilteredInverse")
    public List<MapDataDTO> getInverseFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
        return wastes.stream()
                .map(wasteMapper::toMapData)
                .collect(Collectors.toList());
    }
}
