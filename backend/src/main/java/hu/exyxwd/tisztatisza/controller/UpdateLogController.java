package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<UpdateLog>> getAllLogs() {
        List<UpdateLog> logs = updateLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteLogs(@RequestBody List<Long> ids) {
        List<UpdateLog> logs = updateLogRepository.findAllById(ids);
        if (logs.size() != ids.size()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Some logs do not exist with the given ids");
        }

        updateLogRepository.deleteAllById(ids);
        return ResponseEntity.ok().build();
    }
}
