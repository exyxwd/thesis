package hu.exyxwd.tisztatisza.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import lombok.AllArgsConstructor;

import hu.exyxwd.tisztatisza.model.UpdateLog;
import hu.exyxwd.tisztatisza.repository.UpdateLogRepository;
import hu.exyxwd.tisztatisza.exception.ResourceNotFoundException;

// TODO: response entities
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
        List<UpdateLog> logs = updateLogRepository.findAllById(ids);
        if (logs.size() != ids.size()) {
            throw new ResourceNotFoundException("Some logs do not exist with the given ids");
        }

        updateLogRepository.deleteAllById(ids);
    }
}
