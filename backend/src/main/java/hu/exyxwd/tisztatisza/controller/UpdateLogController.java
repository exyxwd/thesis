package hu.exyxwd.tisztatisza.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import lombok.AllArgsConstructor;

import hu.exyxwd.tisztatisza.model.UpdateLog;
import hu.exyxwd.tisztatisza.repository.UpdateLogRepository;

@RestController
@AllArgsConstructor
@RequestMapping("/api/logs")
public class UpdateLogController {
    private final UpdateLogRepository updateLogRepository;

    @GetMapping
    public List<UpdateLog> getAllLogs() {
        return updateLogRepository.findAll();
    }

    @DeleteMapping
    public void deleteLogs(@RequestBody List<Long> ids) {
        updateLogRepository.deleteAllById(ids);
    }
}
