package hu.exyxwd.tisztatisza;

import org.springframework.boot.SpringApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableScheduling
public class TisztaTiszaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TisztaTiszaApplication.class, args);
    }
}