package hu.exyxwd.tisztatisza.service;

import org.json.simple.*;
import org.json.simple.parser.*;
import org.springframework.http.*;
import org.springframework.web.client.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.util.*;
import java.time.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import jakarta.transaction.Transactional;

@Service
public class TrashOutService {
    private static final String GOOGLE_PASSWORD_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
    private static final String TRASH_OUT_URL = "https://api.trashout.ngo/v1/trash/?attributesNeeded=id,gpsFull,types,size,note,"
            + "status,images,updateTime,created,spam&limit=999999&geoAreaContinent=Europe";

    @Autowired
    private final WasteRepository wasteRepository;
    private RestTemplate restTemplate;
    private JSONObject config;

    public TrashOutService(WasteRepository wasteRepository) {
        this.wasteRepository = wasteRepository;
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
        JSONObject requestBody = new JSONObject();
        requestBody.put("email", config.get("Login:Email"));
        requestBody.put("password", config.get("Login:Password"));
        requestBody.put("returnSecureToken", true);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate
                .postForEntity(GOOGLE_PASSWORD_URL + config.get("Login:GoogleAPIKey"), entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JSONObject responseBody = (JSONObject) JSONValue.parse(response.getBody());
            return (String) responseBody.get("idToken");
        } else {
            System.out.println("Error occurred while trying to get token: " + response.getStatusCode());
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
            } catch (HttpServerErrorException e) {
                System.out.println("Error occurred while trying to get wastes from TrashOut (Attempt " + attempt + "): "
                        + e.getStatusCode());
            }
        }
        // If all attempts fail, return null
        return null;
    }

    public Waste parseWaste(JSONObject wasteJSON) {
        Waste waste = new Waste();

        // Set GPS coordinates and country
        JSONObject gps = (JSONObject) wasteJSON.get("gps");
        if (gps != null) {
            waste.setLatitude((Double) gps.get("lat"));
            waste.setLongitude((Double) gps.get("long"));

            JSONObject area = (JSONObject) gps.get("area");

            if (area != null) {
                String country = (String) area.get("country");

                if (country != null) {
                    waste.setCountry(Waste.WasteCountry.valueOf(country.toUpperCase()));
                }
            }
        }

        // Set types
        JSONArray typesArray = (JSONArray) wasteJSON.get("types");
        Set<Waste.WasteType> types = new HashSet<>();
        for (Object type : typesArray) {
            types.add(Waste.WasteType.valueOf(type.toString().toUpperCase()));
        }
        waste.setTypes(types);

        // Set images
        JSONArray imagesArray = (JSONArray) wasteJSON.get("images");
        if (imagesArray.size() > 0) {
            JSONObject firstImageObject = (JSONObject) imagesArray.get(0);
            String image = (String) firstImageObject.get("fullDownloadUrl");
            waste.setImageUrl(image);
        }

        // Set other fields
        waste.setId((Long) wasteJSON.get("id"));
        waste.setLocality(
                (String) ((JSONObject) ((JSONObject) wasteJSON.get("gps")).get("area")).get("locality"));
        waste.setSublocality(
                (String) ((JSONObject) ((JSONObject) wasteJSON.get("gps")).get("area")).get("subLocality"));
        waste.setSize(Waste.WasteSize.valueOf(wasteJSON.get("size").toString().toUpperCase()));
        waste.setStatus(Waste.WasteStatus.valueOf(wasteJSON.get("status").toString().toUpperCase()));
        waste.setCreateTime(OffsetDateTime.parse(wasteJSON.get("created").toString()).toLocalDateTime());
        waste.setUpdateTime(OffsetDateTime.parse(wasteJSON.get("updateTime").toString()).toLocalDateTime());
        waste.setNote((String) wasteJSON.get("note"));

        return waste;
    }

    @Transactional
    public void updateDatabase() {
        // String token = getToken();

        // Token for dev purposes from the Trashout serverside code
        String AuthToken = config.get("Login:AuthToken").toString();
        String wasteList = getWasteListFromTrashOut(AuthToken);

        if (wasteList == null) {
            System.out.println("Error: wasteList is null");
            return;
        }

        JSONParser parser = new JSONParser();
        try {
            LocalDateTime sixYearsAgo = OffsetDateTime.now().minusYears(1).toLocalDateTime();

            // Delete all wastes that are older than 6 years
            List<Waste> oldWastes = wasteRepository.findAllOlderThan(sixYearsAgo);
            wasteRepository.deleteAll(oldWastes);

            // Parse the JSON array from TrashOut
            JSONArray wasteArray = (JSONArray) parser.parse(wasteList);

            // Fetch all existing wastes from the database
            List<Waste> existingWastes = wasteRepository.findAll();

            // Convert the list to a map for faster lookup
            Map<Long, Waste> existingWastesMap = existingWastes.stream()
                    .collect(Collectors.toMap(Waste::getId, Function.identity()));

            List<Waste> wastesToSave = new ArrayList<>();

            for (Object o : wasteArray) {
                try {
                    JSONObject wasteJSON = (JSONObject) o;
                    Waste newWaste = parseWaste(wasteJSON);

                    // Check if the waste's ID is already in the database
                    Waste existingWaste = existingWastesMap.get(newWaste.getId());

                    // Only save the waste if it had an update in the past 6 years and it is not in
                    // the database or it has been updated
                    if (newWaste.getUpdateTime().isAfter(sixYearsAgo)
                            && (existingWaste == null || !newWaste.equals(existingWaste))) {
                        wastesToSave.add(newWaste);
                    }
                } catch (IllegalArgumentException e) {
                    continue;
                }
            }
            wasteRepository.saveAll(wastesToSave);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }
}