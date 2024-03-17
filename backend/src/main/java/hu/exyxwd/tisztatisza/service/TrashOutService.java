package hu.exyxwd.tisztatisza.service;

import org.json.simple.*;
import org.json.simple.parser.*;
import org.springframework.http.*;
import org.springframework.web.client.*;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import java.time.OffsetDateTime;
import javax.annotation.PostConstruct;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.repository.WasteRepository;

@Service
public class TrashOutService {
    private static final String GOOGLE_PASSWORD_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
    private static final String TRASH_OUT_URL = "https://api.trashout.ngo/v1/trash/?attributesNeeded=id,gpsShort,gpsFull,types,size,note,"
            + "userInfo,anonymous,status,cleanedByMe,images,updateTime,updateHistory,url,created,accessibility,updateNeeded,unreviewed,spam&limit=99999&geoAreaContinent=Europe";

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

    public String getTrashListFromTrashOut(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.set("x-token", token);

        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(TRASH_OUT_URL, HttpMethod.GET, entity,
                    String.class);
            return response.getBody();
        } catch (HttpServerErrorException e) {
            System.out.println("Error occurred while trying to get trash list from TrashOut: " + e.getStatusCode());
            return null;
        }
    }

    public List<Waste> parseTrashList(String trashList) {
        List<Waste> wastes = new ArrayList<>();
        JSONParser parser = new JSONParser();

        try {
            JSONArray trashArray = (JSONArray) parser.parse(trashList);

            for (Object o : trashArray) {
                try {
                    JSONObject trash = (JSONObject) o;

                    Waste waste = new Waste();
                    waste.setId((Long) trash.get("id"));
                    waste.setLatitude((Double) ((JSONObject) trash.get("gps")).get("lat"));
                    waste.setLongitude((Double) ((JSONObject) trash.get("gps")).get("long"));
                    JSONObject gps = (JSONObject) trash.get("gps");
                    if (gps != null) {
                        JSONObject area = (JSONObject) gps.get("area");
                        if (area != null) {
                            String country = (String) area.get("country");
                            if (country != null) {
                                waste.setCountry(Waste.WasteCountry.valueOf(country.toUpperCase()));
                            }
                        }
                    }
                    // waste.setLocality(
                    // (String) ((JSONObject) ((JSONObject)
                    // trash.get("gps")).get("area")).get("locality"));
                    // waste.setSublocality(
                    // (String) ((JSONObject) ((JSONObject)
                    // trash.get("gps")).get("area")).get("subLocality"));
                    waste.setSize(Waste.WasteSize.valueOf(trash.get("size").toString().toUpperCase()));
                    waste.setStatus(Waste.WasteStatus.valueOf(trash.get("status").toString().toUpperCase()));
                    waste.setCreateTime(OffsetDateTime.parse(trash.get("created").toString()).toLocalDateTime());
                    waste.setUpdateTime(OffsetDateTime.parse(trash.get("updateTime").toString()).toLocalDateTime());
                    waste.setUpdateNeeded(((Long) trash.get("updateNeeded")) != 0);
                    String note = (String) trash.get("note");
                    // if (note != null && note.length() >= 255) {
                    //     note = "Redacted";
                    // }
                    // System.out.println("Note: " + note);
                    waste.setNote(note);

                    JSONArray typesArray = (JSONArray) trash.get("types");
                    List<Waste.WasteType> types = new ArrayList<>();
                    for (Object type : typesArray) {
                        types.add(Waste.WasteType.valueOf(type.toString().toUpperCase()));
                    }
                    waste.setTypes(types);

                    JSONArray imagesArray = (JSONArray) trash.get("images");
                    if (imagesArray.size() > 0) {
                        JSONObject firstImageObject = (JSONObject) imagesArray.get(0);
                        String image = (String) firstImageObject.get("fullDownloadUrl");
                        waste.setImageUrl(image);
                    }
                    // String image = imagesArray[0];
                    // for (Object image : imagesArray) {
                    //     String imageUrl = (String) ((JSONObject) image).get("fullDownloadUrl");
                    //     if (imageUrl != null && imageUrl.length() > 255) {
                    //         // System.out.println("Image URL too long: " + imageUrl);
                    //         // imageUrl = imageUrl.substring(0, 255);
                    //     }
                    //     images.add(imageUrl);
                    // }

                    wastes.add(waste);
                } catch (IllegalArgumentException e) {
                    // Skip this object and continue with the next one
                    continue;
                }
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return wastes;
    }

    @PostConstruct
    public void updateDatabase() {
        String token = getToken();
        String trashList = getTrashListFromTrashOut(token);

        if (trashList != null) {
            // Parse the trashList and convert it into Waste objects
            List<Waste> wastes = parseTrashList(trashList);

            // Save the Waste objects to the database
            wasteRepository.saveAll(wastes);
        } else {
            System.out.println("Error: trashList is null");
        }

    }
}