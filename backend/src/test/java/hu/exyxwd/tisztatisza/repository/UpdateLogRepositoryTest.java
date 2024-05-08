package hu.exyxwd.tisztatisza.repository;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.autoconfigure.orm.jpa.*;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.time.LocalDateTime;

import hu.exyxwd.tisztatisza.model.UpdateLog;

@DataJpaTest
public class UpdateLogRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UpdateLogRepository updateLogRepository;

    @Test
    @DisplayName("Test saving of an update log")
    public void testSave() {
        UpdateLog log = new UpdateLog();
        log.setUpdateTime(LocalDateTime.now());
        log.setUpdateCount(10);
        log.setDeleteCount(5);
        log.setTotalCount(100L);
        log = updateLogRepository.save(log);

        UpdateLog found = entityManager.find(UpdateLog.class, log.getId());

        assertThat(found).isEqualTo(log);
    }

    @Test
    @DisplayName("Test finding an update log by ID")
    public void testFindById() {
        UpdateLog log = new UpdateLog();
        log.setUpdateTime(LocalDateTime.now());
        log.setUpdateCount(10);
        log.setDeleteCount(5);
        log.setTotalCount(100L);
        entityManager.persist(log);
        entityManager.flush();

        Optional<UpdateLog> found = updateLogRepository.findById(log.getId());

        assertThat(found).isPresent().get().isEqualTo(log);
    }
}
