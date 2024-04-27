package hu.exyxwd.tisztatisza.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import hu.exyxwd.tisztatisza.model.UpdateLog;

@Repository
public interface UpdateLogRepository extends JpaRepository<UpdateLog, Long> {
}