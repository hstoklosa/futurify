package dev.hstoklosa.futurify;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
public abstract class AbstractTestcontainers {

    @Container
    @ServiceConnection
    public static final PostgreSQLContainer<?> postgreSQLContainer =
        new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("futurify-testing")
            .withUsername("futurify")
            .withPassword("futurify_pass");


    @DynamicPropertySource
    private static void registerDataSourceProperties(
        DynamicPropertyRegistry registry
    ) {
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }

}
