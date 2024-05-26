package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import java.util.stream.Collectors;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.dto.mapper.WasteMapper;
import hu.exyxwd.tisztatisza.repository.WasteRepository;

/** Controller for handling waste related requests. */
@RestController
@AllArgsConstructor
@RequestMapping("/api/wastes")
public class WasteController {

    @Autowired
    private WasteRepository wasteRepository;

    @Autowired
    private WasteMapper wasteMapper;

    /**
     * Get a waste's detailed data.
     * 
     * @param id The id of the waste.
     * @return Contains the detailed data of the waste.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getWasteById(@PathVariable Long id) {
        Optional<Waste> waste = wasteRepository.findById(id);

        if (!waste.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Waste does not exist with id: " + id);
        }

        return ResponseEntity.ok(wasteMapper.toDetailedWasteDTO(waste.get()));
    }

    /**
     * Get wastes detailed data.
     * @param requestData Contains the ids of the wastes.
     * @return Contains the detailed data of the wastes.
     */
    @PostMapping("/filteredWastes")
    public ResponseEntity<?> getWastesByIds(@RequestBody Map<String, List<Long>> requestData) {
        List<Long> ids = requestData.get("ids");
        List<Waste> wastes = wasteRepository.findAllById(ids);
        if (wastes.size() != ids.size()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Some wastes do not exist with the given ids");
        }
        return ResponseEntity.ok(wastes.stream().map(wasteMapper::toDetailedWasteDTO).collect(Collectors.toList()));
    }

    /**
     * Get all wastes fitting the default filters.
     *
     * @return Contains data of the wastes fitting the default filters.
     */
    @GetMapping("/mapDataFiltered")
    public ResponseEntity<List<MapDataDTO>> getFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);

        return ResponseEntity.ok(wastes.stream().map(wasteMapper::toMapData).collect(Collectors.toList()));
    }

    /**
     * Get all wastes not fitting default filters.
     *
     * @return Contains data of the wastes not fitting default filters.
     */
    @GetMapping("/mapDataFilteredInverse")
    public ResponseEntity<List<MapDataDTO>> getInverseFilteredWastes() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        List<Waste> wastes = wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);

        return ResponseEntity.ok(wastes.stream().map(wasteMapper::toMapData).collect(Collectors.toList()));
    }

    /**
     * Change the hidden status of a waste (visibility).
     *
     * @param id The id of the waste.
     * @param body Contains the new hidden status.
     * @return Indicates the result of the operation.
     */
    @PutMapping("/{id}/hidden")
    public ResponseEntity<?> setHidden(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Optional<Waste> waste = wasteRepository.findById(id);
        if (!waste.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Waste does not exist with id: " + id);
        }

        waste.get().setHidden(body.get("hidden"));
        wasteRepository.save(waste.get());

        return ResponseEntity.ok().build();
    }

    /**
     * Get all hidden wastes.
     *
     * @return Contains data of the hidden wastes.
     */
    @GetMapping("/hidden")
    public ResponseEntity<List<DetailedWasteDTO>> getHiddenWastes() {
        List<Waste> wastes = wasteRepository.findByHidden(true);

        return ResponseEntity.ok(wastes.stream().map(wasteMapper::toDetailedWasteDTO).collect(Collectors.toList()));
    }
}