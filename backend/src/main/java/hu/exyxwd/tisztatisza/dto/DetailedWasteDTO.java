package hu.exyxwd.tisztatisza.dto;

import lombok.*;
import java.util.Set;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import hu.exyxwd.tisztatisza.model.Waste;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetailedWasteDTO {
    private Long id;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Waste.WasteCountry country;
    private String locality;
    private String sublocality;
    private Waste.WasteSize size;
    private Waste.WasteStatus status;
    private Set<Waste.WasteType> types;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String imageUrl;
    private String note;
    private Set<String> rivers;
    private Boolean hidden;
}