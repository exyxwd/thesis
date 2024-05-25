package hu.exyxwd.tisztatisza.service;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.json.simple.parser.*;
import org.json.simple.JSONObject;
import org.springframework.http.*;
import org.springframework.web.client.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.time.*;
import java.util.*;
import java.math.BigDecimal;
import java.util.function.Function;
import java.util.stream.Collectors;

import hu.exyxwd.tisztatisza.model.*;
import hu.exyxwd.tisztatisza.repository.*;

@Service
public class TrashOutService {
    private static final String GOOGLE_PASSWORD_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
    private static final String TRASH_OUT_URL = "https://api.trashout.ngo/v1/trash/?attributesNeeded=id,gpsFull,types,size,note,"
            + "status,images,updateTime,created,spam&limit=999999&geoAreaContinent=Europe";

    @Autowired
    private final WasteRepository wasteRepository;

    @Autowired
    private final UpdateLogRepository updateLogRepository;

    private RestTemplate restTemplate;
    private JSONObject config;

    public TrashOutService(WasteRepository wasteRepository, UpdateLogRepository updateLogRepository) {
        this.wasteRepository = wasteRepository;
        this.updateLogRepository = updateLogRepository;

        this.restTemplate = new RestTemplate();
        JSONParser parser = new JSONParser();
        try {
            this.config = (JSONObject) parser.parse(new FileReader("src/main/resources/config.json"));
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
    }

    // Get authentication token from Google Identity Toolkit for later TrashOut API
    // requests
    public String getToken() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode requestBody = mapper.createObjectNode();
        requestBody.put("email", (String) config.get("Login:Email"));
        requestBody.put("password", (String) config.get("Login:Password"));
        requestBody.put("returnSecureToken", true);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate
                    .postForEntity(GOOGLE_PASSWORD_URL + config.get("Login:GoogleAPIKey"), entity, String.class);
    
            if (response.getStatusCode() == HttpStatus.OK) {
                try {
                    ObjectNode responseBody = (ObjectNode) mapper.readTree(response.getBody());
                    return responseBody.get("idToken").asText();
                } catch (IOException e) {
                    System.out.println("Error occurred while trying to parse response body from Google.");
                    return null;
                }
            } else {
                System.out.println("Error occurred while trying to get token from Google: " + response.getStatusCode());
                return null;
            }
        } catch (HttpClientErrorException e) {
            System.out.println("Error occurred while trying to get the authentication token. The provided Google API key or credentials might be invalid. ");
            return null;
        }
    }

    public String getWasteListFromTrashOut(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("x-token", token);

        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        // Get waste list from TrashOut, retry if an error occurs
        for (int attempt = 1; attempt <= 5; attempt++) {
            try {
                ResponseEntity<String> response = restTemplate.exchange(TRASH_OUT_URL, HttpMethod.GET, entity,
                        String.class);
                return response.getBody();
            } catch (HttpClientErrorException.Unauthorized e) {
                System.out.println("Error occurred while trying to get wastes from TrashOut. The token might not be correct: "
                        + e.getStatusCode());
                return null;
            } catch (HttpServerErrorException e) {
                System.out.println("Error occurred while trying to get wastes from TrashOut (Attempt " + attempt + "): "
                        + e.getStatusCode());
            }
        }
        // If all attempts fail, return null
        return null;
    }

    public Waste parseWaste(ObjectNode wasteJSON) {
        Waste waste = new Waste();

        // Set GPS coordinates and country
        ObjectNode gps = (ObjectNode) wasteJSON.get("gps");
        if (gps != null) {
            waste.setLatitude(BigDecimal.valueOf(gps.get("lat").asDouble()));
            waste.setLongitude(BigDecimal.valueOf(gps.get("long").asDouble()));

            ObjectNode area = (ObjectNode) gps.get("area");

            if (area != null) {
                String country = area.get("country").asText();

                if (country != null) {
                    waste.setCountry(Waste.WasteCountry.valueOf(country.toUpperCase()));
                }
            }
        }

        // Set types
        ArrayNode typesArray = (ArrayNode) wasteJSON.get("types");
        Set<Waste.WasteType> types = new HashSet<>();
        for (JsonNode type : typesArray) {
            types.add(Waste.WasteType.valueOf(type.asText().toUpperCase()));
        }
        waste.setTypes(types);

        // Set images
        ArrayNode imagesArray = (ArrayNode) wasteJSON.get("images");
        if (imagesArray.size() > 0) {
            ObjectNode firstImageObject = (ObjectNode) imagesArray.get(0);
            String image = firstImageObject.get("fullDownloadUrl").asText();
            waste.setImageUrl(image);
        }

        // Set other fields
        waste.setId(wasteJSON.get("id").asLong());
        waste.setLocality(((wasteJSON.get("gps")).get("area")).get("locality").asText());
        waste.setSublocality(((wasteJSON.get("gps")).get("area")).get("subLocality").asText());
        waste.setSize(Waste.WasteSize.valueOf(wasteJSON.get("size").asText().toUpperCase()));
        waste.setStatus(Waste.WasteStatus.valueOf(wasteJSON.get("status").asText().toUpperCase()));
        waste.setCreateTime(OffsetDateTime.parse(wasteJSON.get("created").asText()).toLocalDateTime());
        waste.setUpdateTime(OffsetDateTime.parse(wasteJSON.get("updateTime").asText()).toLocalDateTime());
        waste.setNote(wasteJSON.get("note").asText());

        return waste;
    }

    @Transactional
    public void updateDatabase() {
        String authToken;
        if ((boolean) config.get("UseStoredToken")) {
            authToken = config.get("AuthToken").toString();
        } else {
            authToken = getToken();
        }

        if (authToken == null || authToken.isEmpty()) {
            System.out.println("The database update failed because of invalid authentication token.");
            return;
        }

        String wasteList = getWasteListFromTrashOut(authToken);

        if (wasteList == null) {
            System.out.println("The database update failed because of invalid data from TrashOut.");
            return;
        }

        LocalDateTime XYearsAgo = OffsetDateTime.now().minusYears(6).toLocalDateTime();

        Integer deleteCount = deleteOldWastes(XYearsAgo);

        List<Waste> wastesToSave = processWasteList(wasteList, XYearsAgo);

        wasteRepository.saveAll(wastesToSave);

        saveUpdateLog(wastesToSave, deleteCount);
    }

    public Integer deleteOldWastes(LocalDateTime XYearsAgo) {
        List<Waste> oldWastes = wasteRepository.findAllOlderThan(XYearsAgo);
        for (Waste waste : oldWastes) {
            waste.getTypes().clear();
            wasteRepository.save(waste);
        }
        wasteRepository.deleteAll(oldWastes);

        return oldWastes.size();
    }

    public List<Waste> processWasteList(String wasteList, LocalDateTime XYearsAgo) {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode wasteArray = null;
        try {
            wasteArray = (ArrayNode) mapper.readTree(wasteList);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
        List<Waste> existingWastes = wasteRepository.findAll();
        Map<Long, Waste> existingWastesMap = existingWastes.stream()
                .collect(Collectors.toMap(Waste::getId, Function.identity()));
        List<Waste> wastesToSave = new ArrayList<>();

        for (JsonNode o : wasteArray) {
            try {
                ObjectNode wasteJSON = (ObjectNode) o;
                Waste newWaste = parseWaste(wasteJSON);
                Waste existingWaste = existingWastesMap.get(newWaste.getId());
                if (existingWaste != null) {
                    newWaste.setHidden(existingWaste.isHidden());
                }
                if (newWaste.getUpdateTime().isAfter(XYearsAgo)
                        && (existingWaste == null || !newWaste.equals(existingWaste))) {
                    wastesToSave.add(newWaste);
                }
            } catch (IllegalArgumentException e) {
                continue;
            }
        }
        return wastesToSave;
    }

    public void saveUpdateLog(List<Waste> wastesToSave, Integer deleteCount) {
        Integer updateCount = wastesToSave.size();
        Long totalCount = wasteRepository.count();

        UpdateLog updateLog = new UpdateLog();
        updateLog.setUpdateTime(LocalDateTime.now());
        updateLog.setDeleteCount(deleteCount);
        updateLog.setUpdateCount(updateCount);
        updateLog.setTotalCount(totalCount);

        updateLogRepository.save(updateLog);
    }
}