package com.projectmanager.planthings.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.mock.web.MockHttpSession;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("migrationtest")
class FlywayMigrationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static @NonNull MediaType jsonMediaType() {
        return Objects.requireNonNull(MediaType.APPLICATION_JSON);
    }

    private static @NonNull String requiredBody(String value) {
        return Objects.requireNonNull(value);
    }

    private static @NonNull MockHttpSession requiredSession(MvcResult result) {
        return Objects.requireNonNull((MockHttpSession) result.getRequest().getSession(false));
    }

    @Test
    void shouldApplyExpectedFlywayVersionsAndSchemaColumns() {
        List<String> versions = jdbcTemplate.queryForList(
                "SELECT version FROM flyway_schema_history WHERE success = TRUE AND version IS NOT NULL ORDER BY installed_rank",
                String.class
        );

        Integer posicaoColumns = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Cartao' AND COLUMN_NAME = 'posicao'",
                Integer.class
        );

        Integer wallpaperLength = jdbcTemplate.queryForObject(
                "SELECT CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Plano' AND COLUMN_NAME = 'wallpaper_url'",
                Integer.class
        );

        assertEquals(List.of("1", "2", "3", "4"), versions);
        assertEquals(1, posicaoColumns);
        assertTrue(wallpaperLength != null && wallpaperLength >= 2048);
    }

    @Test
    void shouldExecuteRealControllerToDatabaseFlowAgainstFlywaySchema() throws Exception {
        createPerfil("migration-user@example.com");
        MockHttpSession session = authenticate("migration-user@example.com", "senha123");
        Long planoId = createPlano(session, "Plano com Flyway");
        Long listaId = createLista(session, planoId, "A Fazer");

        createTarefa(session, listaId, "Primeira tarefa", "2026-03-20T09:00:00");
        createTarefa(session, listaId, "Segunda tarefa", "2026-03-21T10:30:00");

        mockMvc.perform(get("/api/v1/planos/me/{planoId}/board", planoId).session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plano.id").value(planoId))
                .andExpect(jsonPath("$.listas[0].id").value(listaId))
                .andExpect(jsonPath("$.listas[0].cartoes.length()").value(2))
                .andExpect(jsonPath("$.listas[0].cartoes[0].tipo").value("TAREFA"))
                .andExpect(jsonPath("$.listas[0].cartoes[0].posicao").value(0))
                .andExpect(jsonPath("$.listas[0].cartoes[0].nome").value("Primeira tarefa"))
                .andExpect(jsonPath("$.listas[0].cartoes[1].posicao").value(1))
                .andExpect(jsonPath("$.listas[0].cartoes[1].nome").value("Segunda tarefa"));
    }

    @Test
    void shouldRequireSessionForProtectedRoutes() throws Exception {
        mockMvc.perform(get("/api/v1/planos/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Autenticação necessária"));
    }

    @Test
    void shouldNotExposeAnotherUsersPlanToAuthenticatedProfile() throws Exception {
        createPerfil("owner@example.com");
        MockHttpSession ownerSession = authenticate("owner@example.com", "senha123");
        Long planoId = createPlano(ownerSession, "Plano privado");

        createPerfil("intruder@example.com");
        MockHttpSession intruderSession = authenticate("intruder@example.com", "senha123");

        mockMvc.perform(get("/api/v1/planos/me/{planoId}/board", planoId).session(intruderSession))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Plano não encontrado para o perfil informado"));

        mockMvc.perform(delete("/api/v1/planos/me/{planoId}", planoId).session(intruderSession))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Plano não encontrado para o perfil informado"));
    }

    private Long createPerfil(String email) throws Exception {
        String body = requiredBody("""
                {
                  "email": "%s",
                  "nome": "Maria",
                  "sobrenome": "Silva",
                  "telefone": "+55 11 99999-0000",
                  "senha": "senha123"
                }
                """.formatted(email));

        MvcResult result = mockMvc.perform(post("/api/v1/perfil")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        return extractId(result);
    }

    private @NonNull MockHttpSession authenticate(String email, String senha) throws Exception {
        String body = requiredBody("""
                {
                  "email": "%s",
                  "senha": "%s"
                }
                """.formatted(email, senha));

        MvcResult result = mockMvc.perform(post("/api/v1/perfil/login")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        return requiredSession(result);
    }

    private Long createPlano(@NonNull MockHttpSession session, String nome) throws Exception {
        String body = requiredBody("""
                {
                  "nome": "%s",
                  "wallpaperUrl": "linear-gradient(135deg, #3b82f6, #6366f1)"
                }
                """.formatted(nome));

        MvcResult result = mockMvc.perform(post("/api/v1/planos/me")
                        .session(session)
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        return extractId(result);
    }

    private Long createLista(@NonNull MockHttpSession session, Long planoId, String nome) throws Exception {
        String body = requiredBody("""
                {
                  "nome": "%s",
                  "cor": "#123456"
                }
                """.formatted(nome));

        MvcResult result = mockMvc.perform(post("/api/v1/listas/me/plano/{planoId}", planoId)
                        .session(session)
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        return extractId(result);
    }

    private void createTarefa(@NonNull MockHttpSession session, Long listaId, String nome, String dataConclusao) throws Exception {
        String body = requiredBody("""
                {
                  "nome": "%s",
                  "descricao": "Cobertura migration-aware",
                  "cor": "#654321",
                  "dataConclusao": "%s"
                }
                """.formatted(nome, dataConclusao));

        mockMvc.perform(post("/api/v1/tarefas/me/lista/{listaId}", listaId)
                        .session(session)
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated());
    }

    private Long extractId(MvcResult result) throws Exception {
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }
}
