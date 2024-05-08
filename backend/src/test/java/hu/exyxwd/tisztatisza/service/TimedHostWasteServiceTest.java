package hu.exyxwd.tisztatisza.service;

import org.mockito.*;
import org.junit.jupiter.api.*;

import static org.mockito.Mockito.*;

public class TimedHostWasteServiceTest {

    @InjectMocks
    private TimedHostWasteService timedHostWasteService;
    
    @Mock
    private TrashOutService trashOutService;

    @Mock
    private RiverService riverService;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test if processing wastes and rivers invokes the correct methods")
    public void testProcessWastesAndRivers() {
        timedHostWasteService.processWastesAndRivers();

        verify(trashOutService, times(1)).updateDatabase();
        verify(riverService, times(1)).loadRivers();
        verify(riverService, times(1)).updateNullRivers();
    }
}