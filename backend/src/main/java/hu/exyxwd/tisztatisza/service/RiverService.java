package hu.exyxwd.tisztatisza.service;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.bedatadriven.jackson.datatype.jts.JtsModule;

import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.util.*;
import java.nio.file.Files;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.repository.WasteRepository;

@Service
public class RiverService {
    private ObjectMapper mapper;
    private Map<Geometry, String> rivers;
    @Autowired
    private WasteRepository wasteRepository;

    public RiverService() {
        this.rivers = new HashMap<>();
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JtsModule());
    }

    public void loadRivers() {
        try {
            // Load geojson file with river data
            File file = new ClassPathResource("osm_rivers.geojson").getFile();
            String content = new String(Files.readAllBytes(file.toPath()));
            ObjectNode node = mapper.readValue(content, ObjectNode.class);

            GeometryFactory geometryFactory = new GeometryFactory();
            // Iterate through all rivers
            for (JsonNode feature : node.get("features")) {
                // Iterate through all coordinates of the river
                for (JsonNode line : feature.get("geometry").get("coordinates")) {
                    List<Coordinate> coordinates = new ArrayList<>();
                    // Store the x and y coordinates of every point
                    for (JsonNode coordinate : line) {
                        Coordinate currentCoordinates = new Coordinate(coordinate.get(0).asDouble(),
                                coordinate.get(1).asDouble());
                        coordinates.add(currentCoordinates);
                    }
                    // Create a LineString from the coordinates
                    LineString lineString = geometryFactory.createLineString(coordinates.toArray(new Coordinate[0]));
                    // Extract the name of the river from the name property
                    String riverName = feature.get("properties").get("name").asText().split(",")[0];
                    this.rivers.put(lineString, riverName);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void updateNullRivers() {
        List<Waste> wastes = wasteRepository.findAll();
        for (Waste waste : wastes) {
            // Calculate the nearby rivers for every waste where the rivers field is null
            if (waste.getRivers() == null) {
                Set<String> nearbyRivers = getNearbyRivers(waste, 0.1);
                waste.setRivers(nearbyRivers);
                wasteRepository.save(waste);
            }
        }
    }

    public Set<String> getNearbyRivers(Waste waste, double threshold) {
        GeometryFactory factory = new GeometryFactory(new PrecisionModel(), 4326);
        // Create a point from the waste's coordinates
        Coordinate wasteCoordinates = new Coordinate(waste.getLongitude(), waste.getLatitude());
        Point wasteLocation = factory.createPoint(wasteCoordinates);

        Set<String> nearbyRivers = new HashSet<>();
        // Iterate through all rivers and check if the waste is within the threshold distance
        for (Map.Entry<Geometry, String> entry : this.rivers.entrySet()) {
            if (wasteLocation.distance(entry.getKey()) <= threshold) {
                nearbyRivers.add(entry.getValue());
            }
        }
        return nearbyRivers;
    }
}