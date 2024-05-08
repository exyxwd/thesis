package hu.exyxwd.tisztatisza.service;

import org.mockito.*;
import org.junit.jupiter.api.*;
import org.locationtech.jts.geom.*;
import org.geotools.referencing.CRS;
import org.geotools.geometry.jts.JTS;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import java.math.BigDecimal;

import hu.exyxwd.tisztatisza.model.Waste;

public class RiverServiceTest {
    
    @InjectMocks
    private RiverService riverService;

    private GeometryFactory geometryFactory = new GeometryFactory();

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Test getting the closest rivers to locations not on river intersections")
    public void testGetClosestRiver() throws Exception {
        riverService.loadRivers();

        CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:3857");
        CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:4326");
        MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS);

        outerLoop: for (Map.Entry<Geometry, String> entry : riverService.getTransformedRivers().entrySet()) {
            Geometry targetGeometry = JTS.transform(entry.getKey(), transform);
            Coordinate transformedCoordinate = targetGeometry.getCoordinate();

            if (transformedCoordinate.x < -180 || transformedCoordinate.x > 180 || transformedCoordinate.y < -90
                    || transformedCoordinate.y > 90) {
                throw new IllegalArgumentException(
                        "Invalid coordinates: longitude " + transformedCoordinate.x + ", latitude "
                                + transformedCoordinate.y);
            }
            Waste waste = new Waste();
            waste.setLatitude(BigDecimal.valueOf(transformedCoordinate.y));
            waste.setLongitude(BigDecimal.valueOf(transformedCoordinate.x));

            CoordinateReferenceSystem sourceCRSBack = CRS.decode("EPSG:4326");
            CoordinateReferenceSystem targetCRSBack = CRS.decode("EPSG:3857");
            MathTransform transformBack = CRS.findMathTransform(sourceCRSBack, targetCRSBack);

            Point selectedLocation = (Point) JTS.transform(geometryFactory.createPoint(transformedCoordinate),
                    transformBack);
            for (Map.Entry<Geometry, String> otherEntry : riverService.getTransformedRivers().entrySet()) {
                if (!entry.equals(otherEntry) && selectedLocation.distance(otherEntry.getKey()) < 1) {
                    continue outerLoop;
                }
            }

            String closestRiver = riverService.getClosestRiver(waste, 1);
            assertEquals(entry.getValue(), closestRiver, "Closest river is not the expected value");
        }
    }
}
