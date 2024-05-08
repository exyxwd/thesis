package hu.exyxwd.tisztatisza.repository;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.autoconfigure.orm.jpa.*;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.time.LocalDateTime;

import hu.exyxwd.tisztatisza.model.Waste;

@DataJpaTest
public class WasteRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private WasteRepository wasteRepository;

    @Test
    @DisplayName("Test finding all wastes older than given date")
    public void testFindAllOlderThan() {
        Waste waste = new Waste();
        waste.setId(1L);
        waste.setUpdateTime(LocalDateTime.now().minusDays(1));
        entityManager.persist(waste);
        entityManager.flush();

        List<Waste> found = wasteRepository.findAllOlderThan(LocalDateTime.now());

        assertThat(found).contains(waste);
    }

    @Test
    @DisplayName("Test finding all wastes matching given filters")
    public void testFindByFilters() {
        Waste waste = new Waste();
        waste.setId(1L);
        waste.setCountry(Waste.WasteCountry.HUNGARY);
        waste.setSize(Waste.WasteSize.BAG);
        waste.setStatus(Waste.WasteStatus.STILLHERE);
        waste.setUpdateTime(LocalDateTime.now());
        entityManager.persist(waste);
        entityManager.flush();

        List<Waste> found = wasteRepository.findByFilters(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, LocalDateTime.now().minusDays(1));

        assertThat(found).contains(waste);
    }

    @Test
    @DisplayName("Test finding all wastes not matching given filters")
    public void testFindByFiltersInverse() {
        Waste waste = new Waste();
        waste.setId(1L);
        waste.setCountry(Waste.WasteCountry.HUNGARY);
        waste.setSize(Waste.WasteSize.BAG);
        waste.setStatus(Waste.WasteStatus.STILLHERE);
        waste.setUpdateTime(LocalDateTime.now().minusDays(2));
        entityManager.persist(waste);
        entityManager.flush();

        List<Waste> found = wasteRepository.findByFiltersInverse(Waste.WasteCountry.HUNGARY, Waste.WasteSize.BAG,
                Waste.WasteStatus.STILLHERE, LocalDateTime.now());

        assertThat(found).contains(waste);
    }

    @Test
    @DisplayName("Test finding all wastes where the 'hidden' field is true")
    public void testFindByHidden() {
        Waste hiddenWaste = new Waste();
        hiddenWaste.setId(1L);
        hiddenWaste.setHidden(true);
        entityManager.persist(hiddenWaste);

        Waste visibleWaste = new Waste();
        visibleWaste.setId(2L);
        visibleWaste.setHidden(false);
        entityManager.persist(visibleWaste);

        entityManager.flush();

        List<Waste> found = wasteRepository.findByHidden(true);

        assertThat(found).contains(hiddenWaste);
        assertThat(found).doesNotContain(visibleWaste);
    }

    @Test
    @DisplayName("Test finding all wastes")
    public void testFindAll() {
        Waste waste1 = new Waste();
        waste1.setId(1L);
        entityManager.persist(waste1);

        Waste waste2 = new Waste();
        waste2.setId(2L);
        entityManager.persist(waste2);

        entityManager.flush();

        List<Waste> found = wasteRepository.findAll();

        assertThat(found).contains(waste1, waste2);
    }
}
