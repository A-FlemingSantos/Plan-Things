IF OBJECT_ID(N'dbo.CartaoAtribuicao', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CartaoAtribuicao (
        id                      BIGINT          IDENTITY(1,1) PRIMARY KEY,
        cartao_id               BIGINT          NOT NULL,
        perfil_id               BIGINT          NOT NULL,
        assigned_by_perfil_id   BIGINT          NULL,
        created_at              DATETIME2(0)    NOT NULL CONSTRAINT DF_CartaoAtribuicao_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_CartaoAtribuicao_Cartao FOREIGN KEY (cartao_id)
            REFERENCES dbo.Cartao(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_CartaoAtribuicao_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id),
        CONSTRAINT FK_CartaoAtribuicao_AssignedByPerfil FOREIGN KEY (assigned_by_perfil_id)
            REFERENCES dbo.Perfil(id),
        CONSTRAINT UQ_CartaoAtribuicao_Cartao_Perfil UNIQUE (cartao_id, perfil_id)
    );
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_CartaoAtribuicao_Cartao'
      AND object_id = OBJECT_ID(N'dbo.CartaoAtribuicao')
)
BEGIN
    CREATE INDEX IX_CartaoAtribuicao_Cartao ON dbo.CartaoAtribuicao(cartao_id);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_CartaoAtribuicao_Perfil'
      AND object_id = OBJECT_ID(N'dbo.CartaoAtribuicao')
)
BEGIN
    CREATE INDEX IX_CartaoAtribuicao_Perfil ON dbo.CartaoAtribuicao(perfil_id);
END;
GO
