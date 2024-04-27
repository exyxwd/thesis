package hu.exyxwd.tisztatisza.model;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wastes", indexes = {
        @Index(columnList = "country"),
        @Index(columnList = "size"),
        @Index(columnList = "status"),
        @Index(columnList = "updateTime")
})
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

    @Column(precision = 7, scale = 5)
    private BigDecimal latitude;
    @Column(precision = 8, scale = 5)
    private BigDecimal longitude;

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

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> rivers;

    @Override
    public int hashCode() {
        return Objects.hash(id, country, locality, sublocality, size,
                status, types, createTime, updateTime, imageUrl, note);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Waste waste = (Waste) o;

        return Objects.equals(id, waste.id) &&
                country == waste.country &&
                Objects.equals(locality, waste.locality) &&
                Objects.equals(sublocality, waste.sublocality) &&
                size == waste.size &&
                status == waste.status &&
                Objects.equals(types, waste.types) &&
                Objects.equals(createTime, waste.createTime) &&
                Objects.equals(updateTime, waste.updateTime) &&
                Objects.equals(imageUrl, waste.imageUrl) &&
                Objects.equals(note, waste.note);
    }
}
