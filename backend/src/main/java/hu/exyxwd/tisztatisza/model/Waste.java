package hu.exyxwd.tisztatisza.model;

import java.time.LocalDateTime;
import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wastes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
        STILLHERE,
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
        DEADANIMALS,
    }

    @Id
    private Long id;

    private double latitude;
    private double longitude;

    @Enumerated(EnumType.STRING)
    private WasteCountry country;

    @Column(columnDefinition = "text")
    private String locality;

    @Column(columnDefinition = "text")
    private String sublocality;

    @Enumerated(EnumType.STRING)
    private WasteSize size;

    @Enumerated(EnumType.STRING)
    private WasteStatus status;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<WasteType> types;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @Column(columnDefinition = "text")
    private String imageUrl;

    @Column(columnDefinition = "text")
    private String note;

    @ElementCollection
    private Set<String> rivers;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Waste waste = (Waste) o;

        return Double.compare(waste.latitude, latitude) == 0 &&
                Double.compare(waste.longitude, longitude) == 0 &&
                Objects.equals(id, waste.id) &&
                country == waste.country &&
                Objects.equals(locality, waste.locality) &&
                Objects.equals(sublocality, waste.sublocality) &&
                size == waste.size &&
                status == waste.status &&
                Objects.equals(types, waste.types) &&
                Objects.equals(createTime, waste.createTime) &&
                Objects.equals(updateTime, waste.updateTime) &&
                Objects.equals(imageUrl, waste.imageUrl) &&
                Objects.equals(note, waste.note) &&
                Objects.equals(rivers, waste.rivers);
    }
}
