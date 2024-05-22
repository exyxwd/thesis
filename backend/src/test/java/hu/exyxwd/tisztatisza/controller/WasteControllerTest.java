package hu.exyxwd.tisztatisza.controller;

import org.mockito.Mockito;
import org.junit.jupiter.api.*;
import org.springframework.http.*;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.dto.mapper.WasteMapper;
import hu.exyxwd.tisztatisza.repository.WasteRepository;

public class WasteControllerTest {
    private WasteController controller;
    private WasteMapper mockWasteMapper;
    private WasteRepository mockWasteRepository;

    @BeforeEach
    public void init() {
        mockWasteMapper = Mockito.mock(WasteMapper.class);
        mockWasteRepository = Mockito.mock(WasteRepository.class);
        controller = new WasteController(mockWasteRepository, mockWasteMapper);
    }

    @Test
    @DisplayName("Test getting wastes by given ID")
    public void testGetWasteById() {
        Long id = 1L;
        Waste waste = new Waste();
        DetailedWasteDTO dto = new DetailedWasteDTO();

        when(mockWasteRepository.findById(id)).thenReturn(Optional.of(waste));
        when(mockWasteMapper.toDetailedWasteDTO(waste)).thenReturn(dto);

        ResponseEntity<?> response = controller.getWasteById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Getting wastes by ID status code should be OK");
        assertEquals(dto, response.getBody(), "Getting wastes by ID response body is incorrect");
    }

    @Test
    @DisplayName("Test getting wastes by given IDs")
    public void testGetWastesByIds() {
        Long id = 1L;
        Waste waste = new Waste();
        DetailedWasteDTO dto = new DetailedWasteDTO();
        Map<String, List<Long>> requestData = new HashMap<>();
        requestData.put("ids", Arrays.asList(id));

        when(mockWasteRepository.findAllById(requestData.get("ids"))).thenReturn(Arrays.asList(waste));
        when(mockWasteMapper.toDetailedWasteDTO(waste)).thenReturn(dto);

        ResponseEntity<?> response = controller.getWastesByIds(requestData);
        assertTrue(response.getBody() instanceof List<?>, "Getting wastes by given IDs response body should be a list");

        List<?> list = (List<?>) response.getBody();
        for (Object o : list) {
            assertTrue(o instanceof DetailedWasteDTO,
                    "In getting wastes by given IDs each element in the list should be a DetailedWasteDTO");
        }

        List<DetailedWasteDTO> detailedWastes = list.stream()
                .map(o -> (DetailedWasteDTO) o)
                .collect(Collectors.toList());

        assertNotNull(response, "Getting wastes by given IDs response should not be null");
        assertNotNull(detailedWastes, "Getting wastes by given IDs body should not be null");
        assertEquals(1, detailedWastes.size(),
                "Getting wastes by given IDs response does not contain the expected number of elements");
        assertEquals(dto, detailedWastes.get(0), "Getting wastes by given IDs response body is incorrect");
    }

    @Test
    @DisplayName("Test getting wastes by the default filters")
    public void testGetFilteredWastes() {
        Waste waste = new Waste();
        MapDataDTO dto = new MapDataDTO();
        List<Waste> wastes = Arrays.asList(waste);

        when(mockWasteRepository.findByFilters(eq(Waste.WasteCountry.HUNGARY), eq(Waste.WasteSize.BAG),
                eq(Waste.WasteStatus.STILLHERE), any(LocalDateTime.class))).thenReturn(wastes);
        when(mockWasteMapper.toMapData(waste)).thenReturn(dto);

        ResponseEntity<List<MapDataDTO>> response = controller.getFilteredWastes();

        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Getting wastes by default filters status code should be OK");
        List<MapDataDTO> responseBody = response.getBody();
        assertNotNull(responseBody, "Response body should not be null");
        assertEquals(1, responseBody.size(),
                "Getting wastes by default filters response does not contain the expected number of elements");
        assertEquals(dto, responseBody.get(0), "Getting wastes by default filters response body is incorrect");
    }

    @Test
    @DisplayName("Test getting wastes by the inverse of the default filters")
    public void testGetInverseFilteredWastes() {
        Waste waste = new Waste();
        MapDataDTO dto = new MapDataDTO();
        List<Waste> wastes = Arrays.asList(waste);

        when(mockWasteRepository.findByFiltersInverse(eq(Waste.WasteCountry.HUNGARY), eq(Waste.WasteSize.BAG),
                eq(Waste.WasteStatus.STILLHERE), any(LocalDateTime.class))).thenReturn(wastes);
        when(mockWasteMapper.toMapData(waste)).thenReturn(dto);

        ResponseEntity<List<MapDataDTO>> response = controller.getInverseFilteredWastes();

        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "Getting wastes by inverse of default filters status code should be OK");
        List<MapDataDTO> responseBody = response.getBody();
        assertNotNull(responseBody, "Getting wastes by inverse of default filters response body should not be null");
        assertEquals(1, responseBody.size(),
                "Getting wastes by inverse of default filters response does not contain the expected number of elements");
        assertEquals(dto, responseBody.get(0),
                "Getting wastes by inverse of default filters response body is incorrect");
    }

    @Test
    @DisplayName("Test successful setting of a waste's hidden field with the waste's ID")
    public void testSetHidden() {
        Long id = 1L;
        Waste waste = new Waste();
        Map<String, Boolean> body = new HashMap<>();
        body.put("hidden", true);

        when(mockWasteRepository.findById(id)).thenReturn(Optional.of(waste));
        when(mockWasteRepository.save(any(Waste.class))).thenAnswer(i -> i.getArguments()[0]);

        ResponseEntity<?> response = controller.setHidden(id, body);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "Setting waste's hidden field status code should be OK");
        assertTrue(waste.isHidden(),
                "After successful setting of waste's hidden field, the field's value does not match the expected value");
    }

    @Test
    @DisplayName("Test unsuccessful setting of a waste's hidden field beacuse of not existing waste ID")
    public void testSetHiddenResourceNotFound() {
        Long id = 1L;
        Map<String, Boolean> body = new HashMap<>();
        body.put("hidden", true);

        when(mockWasteRepository.findById(id)).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.setHidden(id, body);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "After unsuccessful setting of a waste's hidden field, the response status does not match the expected status");
        assertEquals("Waste does not exist with id: " + id, response.getBody(),
                "After unsuccessful setting of a waste's hidden field, the response body does not match the expected message");
    }

    @Test
    @DisplayName("Test getting all wastes where the hidden field is true")
    public void testGetHiddenWastes() {
        Waste waste = new Waste();
        DetailedWasteDTO dto = new DetailedWasteDTO();

        when(mockWasteRepository.findByHidden(true)).thenReturn(Arrays.asList(waste));
        when(mockWasteMapper.toDetailedWasteDTO(waste)).thenReturn(dto);

        ResponseEntity<List<DetailedWasteDTO>> response = controller.getHiddenWastes();
        List<DetailedWasteDTO> detailedWastes = response.getBody();

        assertNotNull(response, "Getting all wastes where the hidden field is true response should not be null");
        assertNotNull(detailedWastes, "Getting all wastes where the hidden field is true body should not be null");
        assertEquals(1, detailedWastes.size(),
                "Getting all wastes where the hidden field is true response does not contain the expected number of elements");
        assertEquals(dto, detailedWastes.get(0),
                "Getting all wastes where the hidden field is true response body is incorrect");
    }
}