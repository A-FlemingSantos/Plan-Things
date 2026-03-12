package com.projectmanager.planthings.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN;
import static org.springframework.http.HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD;
import static org.springframework.http.HttpHeaders.ORIGIN;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "CODESPACES=true",
        "CODESPACE_NAME=planthings-demo",
        "GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=app.github.dev",
        "VITE_DEV_PORT=5173",
        "VITE_PREVIEW_PORT=4173",
        "APP_CORS_ALLOWED_ORIGINS=https://app.planthings.somee.com"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CorsConfigIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldAllowLocalDevOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/perfil")
                        .header(ORIGIN, "http://localhost:5173")
                        .header(ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    void shouldAllowExactCodespacesOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/perfil")
                        .header(ORIGIN, "https://planthings-demo-5173.app.github.dev")
                        .header(ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, "https://planthings-demo-5173.app.github.dev"));
    }


    @Test
    void shouldAllowConfiguredProductionOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/perfil")
                        .header(ORIGIN, "https://app.planthings.somee.com")
                        .header(ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string(ACCESS_CONTROL_ALLOW_ORIGIN, "https://app.planthings.somee.com"));
    }

    @Test
    void shouldRejectUnexpectedGithubDevOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/perfil")
                        .header(ORIGIN, "https://other-space-5173.app.github.dev")
                        .header(ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(ACCESS_CONTROL_ALLOW_ORIGIN));
    }
}
