package dev.hstoklosa.futurify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FuturifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(FuturifyApplication.class, args);
	}

}
