package hu.exyxwd.tisztatisza.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TimedHostWasteService {
    private final TrashOutService trashOutService;
    private final RiverService riverService;
    private final CacheService cacheService;

    @Scheduled(fixedRate = 4 * 60 * 60 * 1000) // Run every 4 hours
    // @Scheduled(fixedRate = 60 * 1000)
    @Transactional
    public void processWastesAndRivers() {
        System.out.println("Processing wastes and rivers...");
        trashOutService.updateDatabase();

        riverService.loadRivers();

        riverService.updateNullRivers();

        System.out.println("Caching");
        cacheService.cacheInverseFilteredMapData();
        cacheService.cacheFilteredMapData();
    }
}
