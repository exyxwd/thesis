package hu.exyxwd.tisztatisza.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class TimedHostWasteService {
    private final TrashOutService trashOutService;
    private final RiverService riverService;

    public TimedHostWasteService(TrashOutService trashOutService, RiverService riverService) {
        this.trashOutService = trashOutService;
        this.riverService = riverService;
    }

    @PostConstruct
    @Scheduled(fixedRate = 4 * 60 * 60 * 1000) // Run every 4 hours
    // @Scheduled(fixedRate = 60 * 1000)
    @Transactional
    public void processWastesAndRivers() {
        System.out.println("Processing wastes and rivers...");
        trashOutService.updateDatabase();

        riverService.loadRivers();

        riverService.updateNullRivers();
    }
}
