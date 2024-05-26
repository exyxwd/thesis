package hu.exyxwd.tisztatisza.dto.mapper;

import org.mapstruct.Mapper;

import hu.exyxwd.tisztatisza.dto.*;
import hu.exyxwd.tisztatisza.model.Waste;

/** Interface for mapping Waste objects to DTOs. */
@Mapper(componentModel = "spring")
public interface WasteMapper {
    MapDataDTO toMapData(Waste waste);

    DetailedWasteDTO toDetailedWasteDTO(Waste waste);
}