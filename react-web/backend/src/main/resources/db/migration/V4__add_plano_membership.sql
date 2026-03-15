IF OBJECT_ID(N'dbo.ParticipacaoPlano', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ParticipacaoPlano (
        id        BIGINT        IDENTITY(1,1) PRIMARY KEY,
        plano_id  BIGINT        NOT NULL,
        perfil_id BIGINT        NOT NULL,
        papel     VARCHAR(20)   NOT NULL,
        ativo     BIT           NOT NULL CONSTRAINT DF_ParticipacaoPlano_ativo DEFAULT 1,
        CONSTRAINT FK_ParticipacaoPlano_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_ParticipacaoPlano_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id)
            ON DELETE CASCADE,
        CONSTRAINT CK_ParticipacaoPlano_Papel CHECK (papel IN ('MANAGER', 'MEMBER')),
        CONSTRAINT UQ_ParticipacaoPlano UNIQUE (plano_id, perfil_id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ParticipacaoPlano_Plano_Perfil_Ativo' AND object_id = OBJECT_ID(N'dbo.ParticipacaoPlano'))
BEGIN
    CREATE INDEX IX_ParticipacaoPlano_Plano_Perfil_Ativo ON dbo.ParticipacaoPlano(plano_id, perfil_id, ativo);
END;
GO

INSERT INTO dbo.ParticipacaoPlano (plano_id, perfil_id, papel, ativo)
SELECT p.id, p.perfil_id, 'MANAGER', 1
FROM dbo.Plano p
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.ParticipacaoPlano pp
    WHERE pp.plano_id = p.id
      AND pp.perfil_id = p.perfil_id
);
GO
