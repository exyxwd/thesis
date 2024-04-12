package hu.exyxwd.tisztatisza.dto.mapper;

import org.mapstruct.Mapper;

import hu.exyxwd.tisztatisza.dto.MapDataDTO;
import hu.exyxwd.tisztatisza.model.Waste;

@Mapper(componentModel = "spring")
public interface WasteMapper {
    MapDataDTO toMapData(Waste waste);
}