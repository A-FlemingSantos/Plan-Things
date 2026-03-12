package com.projectmanager.planthings.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.config.ConfigDataEnvironmentPostProcessor;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

public class LocalDevelopmentDatasourceEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final Log LOGGER = LogFactory.getLog(LocalDevelopmentDatasourceEnvironmentPostProcessor.class);
    private static final String PROPERTY_SOURCE_NAME = "localDevelopmentDatasourceFallback";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        ConfigurableEnvironment safeEnvironment = Objects.requireNonNull(environment);

        if (!isLocalDevelopmentRun() || hasConfiguredDatasource(safeEnvironment)) {
            return;
        }

        Map<String, Object> fallbackProperties = new LinkedHashMap<>();
        fallbackProperties.put(
                "spring.datasource.url",
                "jdbc:h2:mem:planthings_local;MODE=MSSQLServer;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;DATABASE_TO_UPPER=false"
        );
        fallbackProperties.put("spring.datasource.driverClassName", "org.h2.Driver");
        fallbackProperties.put("spring.datasource.username", "sa");
        fallbackProperties.put("spring.datasource.password", "");
        fallbackProperties.put("spring.jpa.hibernate.ddl-auto", "none");
        fallbackProperties.put("spring.flyway.locations", "classpath:db/migration-h2");

        safeEnvironment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, fallbackProperties));
        LOGGER.info("DB_URL não configurado; usando fallback local com H2 em memória.");
    }

    @Override
    public int getOrder() {
        return ConfigDataEnvironmentPostProcessor.ORDER + 1;
    }

    private boolean hasConfiguredDatasource(@NonNull ConfigurableEnvironment environment) {
        return StringUtils.hasText(readProperty(environment, "DB_URL"))
                || StringUtils.hasText(readProperty(environment, "spring.datasource.url"));
    }

    private @Nullable String readProperty(@NonNull ConfigurableEnvironment environment, @NonNull String key) {
        try {
            return environment.getProperty(key);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private boolean isLocalDevelopmentRun() {
        return ClassUtils.isPresent(
                "org.springframework.boot.devtools.restart.Restarter",
                Thread.currentThread().getContextClassLoader()
        );
    }
}
