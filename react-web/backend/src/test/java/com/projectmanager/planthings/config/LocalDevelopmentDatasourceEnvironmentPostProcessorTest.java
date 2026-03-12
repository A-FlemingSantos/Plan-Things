package com.projectmanager.planthings.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LocalDevelopmentDatasourceEnvironmentPostProcessorTest {

    private final LocalDevelopmentDatasourceEnvironmentPostProcessor postProcessor =
            new LocalDevelopmentDatasourceEnvironmentPostProcessor();

    @Test
    void shouldApplyH2FallbackWhenDatasourceIsMissing() {
        MockEnvironment environment = new MockEnvironment();

        postProcessor.postProcessEnvironment(environment, new SpringApplication(Object.class));

        assertEquals(
                "jdbc:h2:mem:planthings_local;MODE=MSSQLServer;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;DATABASE_TO_UPPER=false",
                environment.getProperty("spring.datasource.url")
        );
        assertEquals("org.h2.Driver", environment.getProperty("spring.datasource.driverClassName"));
        assertEquals("classpath:db/migration-h2", environment.getProperty("spring.flyway.locations"));
    }

    @Test
    void shouldKeepExistingDatasourceConfigurationWhenDbUrlIsProvided() {
        MockEnvironment environment = new MockEnvironment()
                .withProperty("DB_URL", "jdbc:sqlserver://db.example.com:1433;databaseName=planthings");

        postProcessor.postProcessEnvironment(environment, new SpringApplication(Object.class));

        assertEquals("jdbc:sqlserver://db.example.com:1433;databaseName=planthings", environment.getProperty("DB_URL"));
    }
}
