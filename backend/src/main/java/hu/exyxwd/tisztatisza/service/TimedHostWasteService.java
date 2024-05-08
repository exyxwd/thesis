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

    @Scheduled(fixedRate = 4 * 60 * 60 * 1000) // Run every 4 hours
    // @Scheduled(fixedRate = 60 * 1000)
    @Transactional
    public void processWastesAndRivers() {
        System.out.println("Processing wastes...");
        trashOutService.updateDatabase();

        System.out.println("Loading rivers...");
        riverService.loadRivers();

        System.out.println("Updating rivers...");
        riverService.updateNullRivers();

        System.out.println("Done");
    }
}
