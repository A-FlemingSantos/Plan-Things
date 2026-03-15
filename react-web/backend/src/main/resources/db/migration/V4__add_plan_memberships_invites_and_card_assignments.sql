IF OBJECT_ID(N'dbo.PlanoMembro', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlanoMembro (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        plano_id BIGINT NOT NULL,
        perfil_id BIGINT NOT NULL,
        papel VARCHAR(20) NOT NULL,
        CONSTRAINT FK_PlanoMembro_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_PlanoMembro_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id)
            ON DELETE CASCADE,
        CONSTRAINT CK_PlanoMembro_Papel CHECK (papel IN ('MANAGER', 'MEMBER')),
        CONSTRAINT UQ_PlanoMembro UNIQUE (plano_id, perfil_id)
    );
END;
GO

IF OBJECT_ID(N'dbo.PlanoConvite', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlanoConvite (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        plano_id BIGINT NOT NULL,
        convidado_perfil_id BIGINT NOT NULL,
        convidado_email VARCHAR(320) NOT NULL,
        convidador_perfil_id BIGINT NOT NULL,
        status VARCHAR(20) NOT NULL,
        criado_em DATETIME2(0) NOT NULL CONSTRAINT DF_PlanoConvite_CriadoEm DEFAULT SYSUTCDATETIME(),
        respondido_em DATETIME2(0) NULL,
        CONSTRAINT FK_PlanoConvite_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_PlanoConvite_Convidado FOREIGN KEY (convidado_perfil_id)
            REFERENCES dbo.Perfil(id),
        CONSTRAINT FK_PlanoConvite_Convidador FOREIGN KEY (convidador_perfil_id)
            REFERENCES dbo.Perfil(id),
        CONSTRAINT CK_PlanoConvite_Status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'))
    );
END;
GO

IF OBJECT_ID(N'dbo.CartaoAtribuicao', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CartaoAtribuicao (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        cartao_id BIGINT NOT NULL,
        perfil_id BIGINT NOT NULL,
        CONSTRAINT FK_CartaoAtribuicao_Cartao FOREIGN KEY (cartao_id)
            REFERENCES dbo.Cartao(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_CartaoAtribuicao_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id)
            ON DELETE CASCADE,
        CONSTRAINT UQ_CartaoAtribuicao UNIQUE (cartao_id, perfil_id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PlanoMembro_Plano' AND object_id = OBJECT_ID(N'dbo.PlanoMembro'))
BEGIN
    CREATE INDEX IX_PlanoMembro_Plano ON dbo.PlanoMembro(plano_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PlanoConvite_Plano' AND object_id = OBJECT_ID(N'dbo.PlanoConvite'))
BEGIN
    CREATE INDEX IX_PlanoConvite_Plano ON dbo.PlanoConvite(plano_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CartaoAtribuicao_Cartao' AND object_id = OBJECT_ID(N'dbo.CartaoAtribuicao'))
BEGIN
    CREATE INDEX IX_CartaoAtribuicao_Cartao ON dbo.CartaoAtribuicao(cartao_id);
END;
GO
