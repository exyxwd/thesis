package hu.exyxwd.tisztatisza.controller;

import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import hu.exyxwd.tisztatisza.exception.ResourceNotFoundException;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import hu.exyxwd.tisztatisza.model.Waste;

@RestController
@RequestMapping("/api/")
public class WasteController {

    @Autowired
    private WasteRepository wasteRepository;

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

    // update waste rest api
    // @PutMapping("/wastes/{id}")
    // public ResponseEntity<Waste> updatewaste(@PathVariable Long id, @RequestBody Waste wasteDetails) {
    //     Waste waste = wasteRepository.findById(id)
    //             .orElseThrow(() -> new ResourceNotFoundException("Waste does not exist with id: " + id));

    //     waste.setLatitude(wasteDetails.getLatitude());
    //     waste.setLongitude(wasteDetails.getLongitude());
    //     waste.setLocality(wasteDetails.getLocality());
    //     waste.setCountry(wasteDetails.getCountry());

    //     Waste updatedwaste = wasteRepository.save(waste);
    //     return ResponseEntity.ok(updatedwaste);
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
    public List<Object> getFilteredWastes() {
        LocalDateTime twoYearsAgo = LocalDateTime.now().minusYears(2);
        List<Waste> wastes = wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, twoYearsAgo);
        return wastes.stream().map(waste -> new Object() {
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

    @GetMapping("/wastes/mapDataFilteredInverse")
    public List<Object> getInverseFilteredWastes() {
        LocalDateTime twoYearsAgo = LocalDateTime.now().minusYears(2);
        List<Waste> wastes = wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, twoYearsAgo);
        return wastes.stream().map(waste -> new Object() {
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
}
