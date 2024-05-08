package hu.exyxwd.tisztatisza.repository;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.autoconfigure.orm.jpa.*;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

import hu.exyxwd.tisztatisza.model.User;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Test saving of a user")
    public void testSave() {
        User user = new User("username", "password");
        entityManager.persist(user);
        entityManager.flush();

        User found = userRepository.findByUsername(user.getUsername());

        assertThat(found.getUsername()).isEqualTo(user.getUsername());
    }

    @Test
    @DisplayName("Test find user by username")
    public void testFindByUsername() {
        User user = new User("username", "password");
        entityManager.persist(user);
        entityManager.flush();

        boolean exists = userRepository.existsByUsername(user.getUsername());

        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("Test user exists by username")
    public void testExistsByUsername() {
        String notExistingUsername = "notExists";
        String existingUsername = "exists";
        User existingUser = new User(existingUsername, "password");
        entityManager.persist(existingUser);
        entityManager.flush();

        boolean existsNotExisting = userRepository.existsByUsername(notExistingUsername);
        boolean existsExisting = userRepository.existsByUsername(existingUsername);

        assertThat(existsNotExisting).isFalse();
        assertThat(existsExisting).isTrue();
    }
}
