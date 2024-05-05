package hu.exyxwd.tisztatisza.service;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.bedatadriven.jackson.datatype.jts.JtsModule;

import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.geotools.referencing.CRS;
import org.geotools.geometry.jts.JTS;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import java.io.*;
import java.util.*;
import java.nio.file.Files;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.repository.WasteRepository;

// TODO: review this
@Service
public class RiverService {
    private ObjectMapper mapper;
    private Map<Geometry, String> rivers;
    private GeometryFactory geometryFactory;
    @Autowired
    private WasteRepository wasteRepository;

    public RiverService() {
        this.rivers = new HashMap<>();
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JtsModule());
        this.geometryFactory = new GeometryFactory();
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
                    String riverName = feature.get("properties").get("name").asText().split(",")[0].toUpperCase();
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
            if (waste.getRiver() == null) {
                String closestRiver = getClosestRiver(waste, 400);
                waste.setRiver(closestRiver);
                wasteRepository.save(waste);
            }
        }
    }

    public String getClosestRiver(Waste waste, double thresholdInMeters) {
        try {
            CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:4326");
            CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:32632");
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS);
    
            Coordinate wasteCoordinates = new Coordinate(waste.getLongitude().doubleValue(), waste.getLatitude().doubleValue());
            Point wasteLocation = (Point) JTS.transform(geometryFactory.createPoint(wasteCoordinates), transform);
    
            String closestRiver = null;
            double closestDistance = Double.MAX_VALUE;
            for (Map.Entry<Geometry, String> entry : this.rivers.entrySet()) {
                Geometry riverGeometry = JTS.transform(entry.getKey(), transform);
                double distance = wasteLocation.distance(riverGeometry);
                if (distance <= thresholdInMeters && distance < closestDistance) {
                    closestDistance = distance;
                    closestRiver = entry.getValue();
                }
            }
            return closestRiver;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}