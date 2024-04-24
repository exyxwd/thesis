package hu.exyxwd.tisztatisza.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import hu.exyxwd.tisztatisza.model.Waste;

@Repository
public interface WasteRepository extends JpaRepository<Waste, Long> {
    @Query("SELECT w FROM Waste w WHERE w.updateTime < :date")
    List<Waste> findAllOlderThan(@Param("date") LocalDateTime date);

    @Query("SELECT w FROM Waste w WHERE w.country = :country AND w.size = :size AND w.status = :status AND w.updateTime > :updateTime")
    List<Waste> findByFilters(@Param("country") Waste.WasteCountry country, @Param("size") Waste.WasteSize size,
            @Param("status") Waste.WasteStatus status, @Param("updateTime") LocalDateTime updateTime);

    @Query("SELECT w FROM Waste w WHERE w.country != :country OR w.size != :size OR w.status != :status OR w.updateTime < :updateTime")
    List<Waste> findByFiltersInverse(@Param("country") Waste.WasteCountry country, @Param("size") Waste.WasteSize size,
            @Param("status") Waste.WasteStatus status, @Param("updateTime") LocalDateTime updateTime);
}