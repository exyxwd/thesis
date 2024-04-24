package hu.exyxwd.tisztatisza.dto.mapper;

import org.mapstruct.Mapper;

import hu.exyxwd.tisztatisza.model.Waste;
import hu.exyxwd.tisztatisza.dto.MapDataDTO;

@Mapper(componentModel = "spring")
public interface WasteMapper {
    MapDataDTO toMapData(Waste waste);
}