import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Paths;

import hu.exyxwd.tisztatisza.exception.ResourceNotFoundException;
import hu.exyxwd.tisztatisza.repository.WasteRepository;
import hu.exyxwd.tisztatisza.model.Waste;

@SpringBootApplication
public class TisztaTiszaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TisztaTiszaApplication.class, args);
    }

}