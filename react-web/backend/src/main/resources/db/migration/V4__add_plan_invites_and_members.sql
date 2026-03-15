IF OBJECT_ID(N'dbo.PlanoMembro', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlanoMembro (
        id         BIGINT        IDENTITY(1,1) PRIMARY KEY,
        plano_id   BIGINT        NOT NULL,
        perfil_id  BIGINT        NOT NULL,
        created_at DATETIME2(0)  NOT NULL CONSTRAINT DF_PlanoMembro_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_PlanoMembro_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_PlanoMembro_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id)
            ON DELETE CASCADE,
        CONSTRAINT UQ_PlanoMembro_Plano_Perfil UNIQUE (plano_id, perfil_id)
    );
END;
GO

IF OBJECT_ID(N'dbo.PlanoConvite', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlanoConvite (
        id                 BIGINT         IDENTITY(1,1) PRIMARY KEY,
        plano_id           BIGINT         NOT NULL,
        inviter_perfil_id  BIGINT         NOT NULL,
        invitee_perfil_id  BIGINT         NULL,
        invitee_email      VARCHAR(320)   NULL,
        status             VARCHAR(20)    NOT NULL CONSTRAINT DF_PlanoConvite_status DEFAULT 'PENDING',
        created_at         DATETIME2(0)   NOT NULL CONSTRAINT DF_PlanoConvite_created_at DEFAULT SYSUTCDATETIME(),
        responded_at       DATETIME2(0)   NULL,
        message            NVARCHAR(500)  NULL,
        CONSTRAINT FK_PlanoConvite_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT FK_PlanoConvite_InviterPerfil FOREIGN KEY (inviter_perfil_id)
            REFERENCES dbo.Perfil(id),
        CONSTRAINT FK_PlanoConvite_InviteePerfil FOREIGN KEY (invitee_perfil_id)
            REFERENCES dbo.Perfil(id),
        CONSTRAINT CK_PlanoConvite_Destinatario CHECK (invitee_perfil_id IS NOT NULL OR invitee_email IS NOT NULL),
        CONSTRAINT CK_PlanoConvite_Status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED'))
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

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PlanoConvite_Plano' AND object_id = OBJECT_ID(N'dbo.PlanoConvite'))
BEGIN
    CREATE INDEX IX_PlanoConvite_Plano ON dbo.PlanoConvite(plano_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_PlanoConvite_InviteePerfil' AND object_id = OBJECT_ID(N'dbo.PlanoConvite'))
BEGIN
    CREATE INDEX IX_PlanoConvite_InviteePerfil ON dbo.PlanoConvite(invitee_perfil_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_PlanoConvite_Pending_Perfil' AND object_id = OBJECT_ID(N'dbo.PlanoConvite'))
BEGIN
    CREATE UNIQUE INDEX UQ_PlanoConvite_Pending_Perfil
        ON dbo.PlanoConvite(plano_id, invitee_perfil_id)
        WHERE status = 'PENDING' AND invitee_perfil_id IS NOT NULL;
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_PlanoConvite_Pending_Email' AND object_id = OBJECT_ID(N'dbo.PlanoConvite'))
BEGIN
    CREATE UNIQUE INDEX UQ_PlanoConvite_Pending_Email
        ON dbo.PlanoConvite(plano_id, invitee_email)
        WHERE status = 'PENDING' AND invitee_perfil_id IS NULL AND invitee_email IS NOT NULL;
END;
GO
