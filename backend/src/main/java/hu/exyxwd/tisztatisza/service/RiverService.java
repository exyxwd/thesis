package hu.exyxwd.tisztatisza.service;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.bedatadriven.jackson.datatype.jts.JtsModule;

import org.locationtech.jts.geom.*;
import org.geotools.referencing.CRS;
import org.geotools.geometry.jts.JTS;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.util.*;
import lombok.Getter;
import java.nio.file.Files;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.repository.WasteRepository;

// TODO: review this, optimize maybe

@Getter
@Service
public class RiverService {
    public ObjectMapper mapper;
    public GeometryFactory geometryFactory;
    public Map<Geometry, String> transformedRivers;
    @Autowired
    public WasteRepository wasteRepository;

    public RiverService() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JtsModule());
        this.geometryFactory = new GeometryFactory();
        this.transformedRivers = new HashMap<>();
    }

    public void loadRivers() {
        try {
            // Load geojson file with river data
            File file = new ClassPathResource("osm_rivers.geojson").getFile();
            String content = new String(Files.readAllBytes(file.toPath()));
            ObjectNode node = mapper.readValue(content, ObjectNode.class);

            CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:4326");
            CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:3857");
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);

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
                    // Transform the LineString
                    LineString transformedLineString = (LineString) JTS.transform(lineString, transform);
                    // Extract the name of the river from the name property
                    String riverName = feature.get("properties").get("name").asText().split(",")[0].toUpperCase();
                    // Extract the name of the river from the name property
                    this.transformedRivers.put(transformedLineString, riverName);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void updateNullRivers() {
        long startTime = System.currentTimeMillis();
    
        List<Waste> wastes = wasteRepository.findAll();
        for (Waste waste : wastes) {
            // Calculate the nearby rivers for every waste where the rivers field is null
            if (waste.getRiver() == null) {
                String closestRiver = getClosestRiver(waste, 400);
                waste.setRiver(closestRiver);
                wasteRepository.save(waste);
            }
        }
    
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        System.out.println("updateNullRivers took " + duration + " milliseconds");
    }

    public String getClosestRiver(Waste waste, double thresholdInMeters) {
        try {
            CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:4326");
            CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:3857"); // Was 32632
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);
        
            // Ensure the coordinates are within the valid range for the projection
            double longitude = waste.getLongitude().doubleValue();
            double latitude = waste.getLatitude().doubleValue();
            if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                System.out.println(latitude + " Illegal coordinates " + longitude);
                throw new IllegalArgumentException("Invalid coordinates: longitude " + longitude + ", latitude " + latitude);
            }
        
            Coordinate wasteCoordinates = new Coordinate(longitude, latitude);
            Point wasteLocation = (Point) JTS.transform(geometryFactory.createPoint(wasteCoordinates), transform);
        
            String closestRiver = "";
            double closestDistance = Double.MAX_VALUE;
            for (Map.Entry<Geometry, String> entry : this.transformedRivers.entrySet()) {
                // Geometry riverGeometry = JTS.transform(entry.getKey(), transform);
                double distance = wasteLocation.distance(entry.getKey());
                if (distance <= thresholdInMeters && distance < closestDistance) {
                    closestDistance = distance;
                    closestRiver = entry.getValue();
                }
            }
            return closestRiver;
        } catch (Exception e) {
            System.out.println("Exception in getClosestRiver: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}