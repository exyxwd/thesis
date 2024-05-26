package hu.exyxwd.tisztatisza.dto;

import lombok.*;
import java.util.Set;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import hu.exyxwd.tisztatisza.model.Waste;

/** DTO to represent the waste data the map needs. */
@Getter
@Setter
public class MapDataDTO {
    private Long id;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Waste.WasteCountry country;
    private Waste.WasteSize size;
    private Waste.WasteStatus status;
    private Set<Waste.WasteType> types;
    private String river;
    private LocalDateTime updateTime;
    private Boolean hidden;
}