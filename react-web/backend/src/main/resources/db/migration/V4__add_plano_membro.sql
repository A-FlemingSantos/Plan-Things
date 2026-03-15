IF OBJECT_ID(N'dbo.PlanoMembro', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlanoMembro (
        id          BIGINT          IDENTITY(1,1) PRIMARY KEY,
        plano_id    BIGINT          NOT NULL,
        perfil_id   BIGINT          NOT NULL,
        papel       VARCHAR(20)     NOT NULL,
        status      VARCHAR(20)     NULL,
        created_at  DATETIME2(0)    NOT NULL CONSTRAINT DF_PlanoMembro_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_PlanoMembro_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_PlanoMembro_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id)
            ON DELETE CASCADE,
        CONSTRAINT UQ_PlanoMembro_Plano_Perfil UNIQUE (plano_id, perfil_id),
        CONSTRAINT CK_PlanoMembro_Papel CHECK (papel IN ('MANAGER', 'MEMBER')),
        CONSTRAINT CK_PlanoMembro_Status CHECK (status IS NULL OR status IN ('ACTIVE', 'REMOVED'))
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PlanoMembro_Plano' AND object_id = OBJECT_ID(N'dbo.PlanoMembro'))
BEGIN
    CREATE INDEX IX_PlanoMembro_Plano ON dbo.PlanoMembro(plano_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PlanoMembro_Perfil' AND object_id = OBJECT_ID(N'dbo.PlanoMembro'))
BEGIN
    CREATE INDEX IX_PlanoMembro_Perfil ON dbo.PlanoMembro(perfil_id);
END;
GO
