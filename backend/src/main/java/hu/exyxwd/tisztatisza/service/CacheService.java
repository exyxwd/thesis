package hu.exyxwd.tisztatisza.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CacheService {
    @Autowired
    private final WasteRepository wasteRepository;

    @CachePut(value = "filteredMapData", unless = "#result == null || #result.isEmpty()")
    public List<Waste> cacheFilteredMapData() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        return wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
    }

    @CachePut(value = "inverseFilteredMapData", unless = "#result == null || #result.isEmpty()")
    public List<Waste> cacheInverseFilteredMapData() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        return wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, oneYearAgo);
    }
}
