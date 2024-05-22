package hu.exyxwd.tisztatisza.controller;

import org.mockito.Mockito;
import org.junit.jupiter.api.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

import hu.exyxwd.tisztatisza.model.UpdateLog;
import hu.exyxwd.tisztatisza.repository.UpdateLogRepository;

public class UpdateLogControllerTest {
    private UpdateLogRepository updateLogRepository;
    private UpdateLogController updateLogController;

    @BeforeEach
    public void init() {
        updateLogRepository = Mockito.mock(UpdateLogRepository.class);
        updateLogController = new UpdateLogController(updateLogRepository);
    }

    @Test
    @DisplayName("Test getting all update logs")
    public void testGetAllLogs() {
        UpdateLog log1 = new UpdateLog();
        UpdateLog log2 = new UpdateLog();
        when(updateLogRepository.findAll()).thenReturn(Arrays.asList(log1, log2));

        ResponseEntity<List<UpdateLog>> response = updateLogController.getAllLogs();
        List<UpdateLog> logs = response.getBody();

        assertNotNull(logs, "After getting all update logs, the logs are null");

        assertEquals(2, logs.size(),
                "After getting all update logs the number of logs does not match the expected value");
        assertEquals(log1, logs.get(0),
                "After getting all update logs the first log does not match the expected value");
        assertEquals(log2, logs.get(1),
                "After getting all update logs the second log does not match the expected value");
    }

    @Test
    @DisplayName("Test successful deletion of update logs by given IDs")
    public void testDeleteLogs() {
        List<Long> ids = Arrays.asList(1L, 2L);
        List<UpdateLog> logs = Arrays.asList(new UpdateLog(), new UpdateLog());

        when(updateLogRepository.findAllById(ids)).thenReturn(logs);

        updateLogController.deleteLogs(ids);

        verify(updateLogRepository).deleteAllById(ids);
    }

    @Test
    @DisplayName("Test unsuccessful deletion of logs by IDs because of not existing logs with the given IDs")
    public void testDeleteLogsWithNonExistentIds() {
        List<Long> ids = Arrays.asList(1L, 2L);
        List<UpdateLog> logs = new ArrayList<>();

        when(updateLogRepository.findAllById(ids)).thenReturn(logs);

        ResponseEntity<?> response = updateLogController.deleteLogs(ids);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "Response status does not match the expected value");
    }
}