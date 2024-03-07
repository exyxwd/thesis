package hu.exyxwd.tisztatisza.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wastes")
@Getter @Setter 
@NoArgsConstructor @AllArgsConstructor
public class Waste {
    public enum WasteCountry {
        HUNGARY,
        UKRAINE,
        ROMANIA,
        SERBIA,
        SLOVAKIA,
    }

    public enum WasteSize {
        BAG,
        WHEELBARROW,
        CAR,
    }

    public enum WasteStatus {
        STILL_HERE,
        CLEANED,
        MORE,
    }

    public enum WasteType {
        PLASTIC,
        METAL,
        GLASS,
        DOMESTIC,
        CONSTRUCTION,
        LIQUID,
        DANGEROUS,
        AUTOMOTIVE,
        ELECTRONIC,
        ORGANIC,
        DEAD_ANIMALS,
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double latitude;
    private double longitude;

    @ElementCollection
    private List<String> accessibilities;

    @Enumerated(EnumType.STRING)
    private WasteCountry country;

    private String locality;
    private String sublocality;

    @Enumerated(EnumType.STRING)
    private WasteSize size;

    @Enumerated(EnumType.STRING)
    private WasteStatus status;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<WasteType> types;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    private boolean updateNeeded;

    @ElementCollection
    private List<String> images;

    private String note;

    @ElementCollection
    private List<String> rivers;
}
