package com.myfinance.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MigrationService {

    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public void migrateSystemConfigEnumValues() {
        try {
            log.info("Starting SystemConfig enum migration...");

            // Update BOOLEAN type configs
            String updateBooleanSql = """
                UPDATE system_config
                SET config_type = CASE
                    WHEN config_key LIKE 'FEATURE_%' THEN 'FEATURE'
                    WHEN config_key LIKE 'MAINTENANCE_%' THEN 'MAINTENANCE'
                    WHEN config_key LIKE '%SECURITY%' OR config_key LIKE '%LOGIN%' OR config_key LIKE '%SESSION%' THEN 'SECURITY'
                    ELSE 'APPLICATION'
                END
                WHERE config_type = 'BOOLEAN'
                """;

            int booleanUpdated = jdbcTemplate.update(updateBooleanSql);
            log.info("Updated {} BOOLEAN config records", booleanUpdated);

            // Update STRING type configs
            String updateStringSql = """
                UPDATE system_config
                SET config_type = CASE
                    WHEN config_key LIKE 'APP_%' OR config_key LIKE 'DEFAULT_%' THEN 'APPLICATION'
                    WHEN config_key LIKE 'UI_%' OR config_key LIKE 'THEME_%' THEN 'UI'
                    WHEN config_key LIKE 'DB_%' OR config_key LIKE 'DATABASE_%' THEN 'DATABASE'
                    ELSE 'APPLICATION'
                END
                WHERE config_type = 'STRING'
                """;

            int stringUpdated = jdbcTemplate.update(updateStringSql);
            log.info("Updated {} STRING config records", stringUpdated);

            // Update NUMBER type configs
            String updateNumberSql = """
                UPDATE system_config
                SET config_type = CASE
                    WHEN config_key LIKE '%SECURITY%' OR config_key LIKE '%LOGIN%' OR config_key LIKE '%SESSION%' OR config_key LIKE '%TIMEOUT%' THEN 'SECURITY'
                    WHEN config_key LIKE '%PERFORMANCE%' OR config_key LIKE '%LIMIT%' OR config_key LIKE '%MAX%' THEN 'PERFORMANCE'
                    ELSE 'APPLICATION'
                END
                WHERE config_type = 'NUMBER'
                """;

            int numberUpdated = jdbcTemplate.update(updateNumberSql);
            log.info("Updated {} NUMBER config records", numberUpdated);

            // Update JSON type configs
            String updateJsonSql = """
                UPDATE system_config
                SET config_type = 'APPLICATION'
                WHERE config_type = 'JSON'
                """;

            int jsonUpdated = jdbcTemplate.update(updateJsonSql);
            log.info("Updated {} JSON config records", jsonUpdated);

            // Log the final counts
            String countSql = """
                SELECT config_type, COUNT(*) as count
                FROM system_config
                GROUP BY config_type
                ORDER BY config_type
                """;

            jdbcTemplate.query(countSql, (rs) -> {
                log.info("Config type: {} - Count: {}", rs.getString("config_type"), rs.getInt("count"));
            });

            log.info("SystemConfig enum migration completed successfully!");

        } catch (Exception e) {
            log.error("Error during SystemConfig enum migration", e);
            throw e;
        }
    }

    public boolean needsEnumMigration() {
        try {
            String sql = """
                SELECT COUNT(*) as count
                FROM system_config
                WHERE config_type IN ('BOOLEAN', 'STRING', 'NUMBER', 'JSON')
                """;

            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            return count != null && count > 0;
        } catch (Exception e) {
            log.warn("Error checking if enum migration is needed", e);
            return false;
        }
    }
}