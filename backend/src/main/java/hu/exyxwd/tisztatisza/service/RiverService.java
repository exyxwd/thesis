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

/** This service is for calculating the closest rivers to wastes. */
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

    /** Loads the rivers line strings from the geojson file. */
    public void loadRivers() {
        try {
            // Load geojson file with river data
            File file = new ClassPathResource("osm_rivers.geojson").getFile();
            String content = new String(Files.readAllBytes(file.toPath()));
            ObjectNode node = mapper.readValue(content, ObjectNode.class);

            // Define the source and target coordinate reference systems
            CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:4326");
            CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:3857");
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);

            GeometryFactory geometryFactory = new GeometryFactory();
            // Iterate through all rivers
            for (JsonNode feature : node.get("features")) {
                // Iterate through all coordinates of the river
                for (JsonNode line : feature.get("geometry").get("coordinates")) {
                    List<Coordinate> coordinates = new ArrayList<>();
                    // Store the longitude and latitude coordinates of every point
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
                    this.transformedRivers.put(transformedLineString, riverName);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Updates the rivers field of all wastes in the database where the river is not
     * yet calculated.
     */
    public void updateNullRivers() {
        List<Waste> wastes = wasteRepository.findAll();
        for (Waste waste : wastes) {
            // Calculate the nearby rivers for every waste where the river field is null
            if (waste.getRiver() == null) {
                // Get the closest river within 500 meter
                String closestRiver = getClosestRiver(waste, 500);
                waste.setRiver(closestRiver);
                wasteRepository.save(waste);
            }
        }
    }

    /**
     * Returns the name of the closest river to the given waste within the given
     * threshold in meters.
     *
     * @param waste             The waste to calculate the closest river for.
     * @param thresholdInMeters The threshold in meters.
     * @return The name of the closest river.
     */
    public String getClosestRiver(Waste waste, double thresholdInMeters) {
        try {
            // Ensure the coordinates are within the valid range for the projection
            double longitude = waste.getLongitude().doubleValue();
            double latitude = waste.getLatitude().doubleValue();
            if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                System.out.println(latitude + " Illegal coordinates " + longitude);
                throw new IllegalArgumentException(
                        "Invalid coordinates: longitude " + longitude + ", latitude " + latitude);
            }

            // Define the source and target coordinate reference systems
            CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:4326");
            CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:3857");
            MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);

            // Transform the waste coordinates to the target coordinate reference system
            Coordinate wasteCoordinates = new Coordinate(longitude, latitude);
            Point wasteLocation = (Point) JTS.transform(geometryFactory.createPoint(wasteCoordinates), transform);

            // Iterate through all rivers and find the closest one that is also within the
            // threshold
            String closestRiver = "";
            double closestDistance = Double.MAX_VALUE;
            for (Map.Entry<Geometry, String> entry : this.transformedRivers.entrySet()) {
                // Calculate the distance between the waste and the river, check if it is within
                // the threshold
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