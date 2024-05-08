package hu.exyxwd.tisztatisza.service;

import com.fasterxml.jackson.databind.node.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.mockito.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import hu.exyxwd.tisztatisza.model.*;
import hu.exyxwd.tisztatisza.repository.*;

@ExtendWith(MockitoExtension.class)
class TrashOutServiceTest {

    @InjectMocks
    private TrashOutService trashOutService;

    @Mock
    private WasteRepository wasteRepository;

    @Mock
    private UpdateLogRepository updateLogRepository;

    @Test
    @DisplayName("Test the waste parsing method")
    void testParseWaste() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode wasteJSON = mapper.createObjectNode();

        wasteJSON.put("id", 1L);
        wasteJSON.put("size", "BAG");
        wasteJSON.put("status", "STILLHERE");
        wasteJSON.put("created", "2022-01-01T00:00:00Z");
        wasteJSON.put("updateTime", "2022-01-01T00:00:00Z");
        wasteJSON.put("note", "Test note");

        ObjectNode gps = mapper.createObjectNode();
        gps.put("lat", 47.123);
        gps.put("long", 19.123);

        ObjectNode area = mapper.createObjectNode();
        area.put("country", "HUNGARY");
        area.put("locality", "Budapest");
        area.put("subLocality", "District III.");

        gps.set("area", area);
        wasteJSON.set("gps", gps);

        ArrayNode typesArray = mapper.createArrayNode();
        typesArray.add("PLASTIC");
        wasteJSON.set("types", typesArray);

        ArrayNode imagesArray = mapper.createArrayNode();
        ObjectNode firstImageObject = mapper.createObjectNode();
        firstImageObject.put("fullDownloadUrl", "https://example.com/image.jpg");
        imagesArray.add(firstImageObject);
        wasteJSON.set("images", imagesArray);

        TrashOutService service = new TrashOutService(null, null);

        Waste waste = service.parseWaste(wasteJSON);

        assertEquals(1L, waste.getId(), "Waste ID does not match expected value");
        assertEquals(Waste.WasteSize.BAG, waste.getSize(), "Waste size does not match expected value");
        assertEquals(Waste.WasteStatus.STILLHERE, waste.getStatus(), "Waste status does not match expected value");
        assertEquals(LocalDateTime.parse("2022-01-01T00:00:00"), waste.getCreateTime(),
                "Waste create time does not match expected value");
        assertEquals(LocalDateTime.parse("2022-01-01T00:00:00"), waste.getUpdateTime(),
                "Waste update time does not match expected value");
        assertEquals("Test note", waste.getNote(), "Waste note does not match expected value");
        assertEquals(BigDecimal.valueOf(47.123), waste.getLatitude(), "Waste latitude does not match expected value");
        assertEquals(BigDecimal.valueOf(19.123), waste.getLongitude(),
                "Waste longitude does not match expected value");
        assertEquals(Waste.WasteCountry.HUNGARY, waste.getCountry(), "Waste country does not match expected value");
        assertEquals("Budapest", waste.getLocality(), "Waste locality does not match expected value");
        assertEquals("District III.", waste.getSublocality(), "Waste sublocality does not match expected value");

        Set<Waste.WasteType> expectedTypes = new HashSet<>();
        expectedTypes.add(Waste.WasteType.PLASTIC);
        assertEquals(expectedTypes, waste.getTypes(), "Waste types do not match expected values");

        assertEquals("https://example.com/image.jpg", waste.getImageUrl(),
                "Waste image URL does not match expected value");
    }

    @Test
    @DisplayName("Test the deletion of wastes older than a give date")
    public void testDeleteOldWastes() {
        Waste waste1 = new Waste();
        Waste waste2 = new Waste();
        List<Waste> oldWastes = Arrays.asList(waste1, waste2);

        when(wasteRepository.findAllOlderThan(any(LocalDateTime.class))).thenReturn(oldWastes);

        Integer result = trashOutService.deleteOldWastes(LocalDateTime.now().minusYears(1));

        assertEquals(oldWastes.size(), result, "The number of deleted wastes does not match the expected value");
    }

    @Test
    @DisplayName("Test the saving of update logs")
    public void testSaveUpdateLog() {
        Waste waste1 = new Waste();
        Waste waste2 = new Waste();
        List<Waste> wastesToSave = Arrays.asList(waste1, waste2);

        when(wasteRepository.count()).thenReturn(2L);

        trashOutService.saveUpdateLog(wastesToSave, 1);

        verify(updateLogRepository, times(1)).save(any(UpdateLog.class));
    }
}