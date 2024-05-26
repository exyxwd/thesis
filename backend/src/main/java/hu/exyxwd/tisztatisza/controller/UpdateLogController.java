package hu.exyxwd.tisztatisza.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import lombok.AllArgsConstructor;

import hu.exyxwd.tisztatisza.model.UpdateLog;
import hu.exyxwd.tisztatisza.repository.UpdateLogRepository;

/**
 * Controller for handling update log related requests.
 */
@RestController
@AllArgsConstructor
@RequestMapping("/api/logs")
public class UpdateLogController {
    private final UpdateLogRepository updateLogRepository;

    /**
     * Get all update logs with every detail.
     *
     * @return Contains a list of all UpdateLogs.
     */
    @GetMapping
    public ResponseEntity<List<UpdateLog>> getAllLogs() {
        List<UpdateLog> logs = updateLogRepository.findAll();
        return ResponseEntity.ok(logs);
    }

    /**
     * Delete logs with the given ids.
     *
     * @param ids List of ids of the logs to be deleted.
     * @return Indicates the result of the operation.
     */
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
