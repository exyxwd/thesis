package hu.exyxwd.tisztatisza.service;

import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import lombok.AllArgsConstructor;
import jakarta.transaction.Transactional;

/** This service triggers the scheduled tasks of the application. */
@Service
@AllArgsConstructor
public class TimedHostWasteService {
    private final TrashOutService trashOutService;
    private final RiverService riverService;

    /**
     * Triggers the updating of the wastes in the database and the river calculations.
     */
    @Scheduled(fixedRate = 4 * 60 * 60 * 1000) // Run every 4 hours
    @Transactional
    public void processWastesAndRivers() {
        System.out.println("Processing wastes...");
        trashOutService.updateDatabase();

        System.out.println("Loading rivers...");
        riverService.loadRivers();

        System.out.println("Updating rivers...");
        riverService.updateNullRivers();

        System.out.println("All scheduled tasks finished.");
    }
}
