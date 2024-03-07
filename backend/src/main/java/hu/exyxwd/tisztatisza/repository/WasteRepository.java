package hu.exyxwd.tisztatisza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.exyxwd.tisztatisza.model.Waste;

@Repository
public interface WasteRepository extends JpaRepository<Waste, Long>{

}