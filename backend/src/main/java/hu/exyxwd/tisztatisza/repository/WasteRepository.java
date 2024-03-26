package hu.exyxwd.tisztatisza.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hu.exyxwd.tisztatisza.model.Waste;

@Repository
public interface WasteRepository extends JpaRepository<Waste, Long> {
    @Query("SELECT w FROM Waste w WHERE w.updateTime < :date")
    List<Waste> findAllOlderThan(@Param("date") LocalDateTime date);
}