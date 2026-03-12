package com.projectmanager.planthings.config;

import org.junit.jupiter.api.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MigrationScriptAlignmentTest {

    @Test
    void shouldKeepH2MigrationSetAlignedWithProductionVersions() throws IOException {
        Path projectRoot = Path.of(System.getProperty("user.dir"));
        List<String> productionMigrations = extractSortedFilenames(projectRoot.resolve("src/main/resources/db/migration"));
        List<String> h2Migrations = extractSortedFilenames(projectRoot.resolve("src/main/resources/db/migration-h2"));

        assertEquals(productionMigrations, h2Migrations);
    }

    private List<String> extractSortedFilenames(Path directory) throws IOException {
        try (var files = Files.list(directory)) {
            return files
                .map(path -> path.getFileName().toString())
                .filter(name -> name.startsWith("V") && name.endsWith(".sql"))
                .sorted()
                .toList();
        }
    }
}
