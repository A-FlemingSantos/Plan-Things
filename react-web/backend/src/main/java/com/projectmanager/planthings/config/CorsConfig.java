package com.projectmanager.planthings.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Configuration
public class CorsConfig {

    private final boolean codespaces;
    private final String codespaceName;
    private final String codespacesForwardingDomain;
    private final int devPort;
    private final int previewPort;
    private final String customAllowedOrigins;

    public CorsConfig(
            @Value("${CODESPACES:false}") boolean codespaces,
            @Value("${CODESPACE_NAME:}") String codespaceName,
            @Value("${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:app.github.dev}") String codespacesForwardingDomain,
            @Value("${VITE_DEV_PORT:5173}") int devPort,
            @Value("${VITE_PREVIEW_PORT:4173}") int previewPort,
            @Value("${APP_CORS_ALLOWED_ORIGINS:}") String customAllowedOrigins
    ) {
        this.codespaces = codespaces;
        this.codespaceName = codespaceName;
        this.codespacesForwardingDomain = codespacesForwardingDomain;
        this.devPort = devPort;
        this.previewPort = previewPort;
        this.customAllowedOrigins = customAllowedOrigins;
    }

    @Bean
    WebMvcConfigurer corsConfigurer() {
        String[] allowedOrigins = buildAllowedOrigins();

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    private @NonNull String[] buildAllowedOrigins() {
        Set<String> allowedOrigins = new LinkedHashSet<>();

        allowedOrigins.add("http://localhost:" + devPort);
        allowedOrigins.add("http://127.0.0.1:" + devPort);
        allowedOrigins.add("http://localhost:" + previewPort);
        allowedOrigins.add("http://127.0.0.1:" + previewPort);

        if (codespaces && !codespaceName.isBlank()) {
            allowedOrigins.add("https://" + codespaceName + "-" + devPort + "." + codespacesForwardingDomain);
            allowedOrigins.add("https://" + codespaceName + "-" + previewPort + "." + codespacesForwardingDomain);
        }

        Arrays.stream(customAllowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .forEach(allowedOrigins::add);

        return Objects.requireNonNull(allowedOrigins.toArray(String[]::new));
    }
}
