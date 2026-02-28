IF OBJECT_ID(N'dbo.Perfil', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Perfil (
        id          BIGINT          IDENTITY(1,1) PRIMARY KEY,
        email       VARCHAR(320)    NOT NULL,
        nome        NVARCHAR(50)    NOT NULL,
        sobrenome   NVARCHAR(50)    NULL,
        telefone    VARCHAR(20)     NULL,
        senha       VARBINARY(32)   NOT NULL,
        cod_status  BIT             NOT NULL CONSTRAINT DF_Perfil_cod_status DEFAULT 1,
        CONSTRAINT UQ_Perfil_Email UNIQUE (email),
        CONSTRAINT CK_Perfil_Telefone CHECK (telefone IS NULL OR telefone NOT LIKE '%[^0-9+() -]%')
    );
END;
GO

IF OBJECT_ID(N'dbo.PerfilAtivo', N'V') IS NULL
BEGIN
    EXEC('CREATE VIEW dbo.PerfilAtivo AS
          SELECT id, email, nome, sobrenome, telefone
          FROM dbo.Perfil
          WHERE cod_status = 1');
END;
GO

IF OBJECT_ID(N'dbo.Plano', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Plano (
        id              BIGINT          IDENTITY(1,1) PRIMARY KEY,
        nome            NVARCHAR(50)    NOT NULL,
        wallpaper_url   VARCHAR(2048)   NULL,
        perfil_id       BIGINT          NOT NULL,
        CONSTRAINT FK_Plano_Perfil FOREIGN KEY (perfil_id)
            REFERENCES dbo.Perfil(id)
            ON DELETE CASCADE
    );
END;
GO

IF OBJECT_ID(N'dbo.Lista', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Lista (
        id       BIGINT          IDENTITY(1,1) PRIMARY KEY,
        nome     NVARCHAR(50)    NOT NULL,
        cor      CHAR(7)         NULL,
        plano_id BIGINT          NOT NULL,
        CONSTRAINT FK_Lista_Plano FOREIGN KEY (plano_id)
            REFERENCES dbo.Plano(id)
            ON DELETE CASCADE,
        CONSTRAINT CK_Lista_Cor CHECK (
            cor IS NULL OR cor LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'
        )
    );
END;
GO

IF OBJECT_ID(N'dbo.Cartao', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Cartao (
        id        BIGINT          IDENTITY(1,1) PRIMARY KEY,
        nome      NVARCHAR(50)    NOT NULL,
        descricao NVARCHAR(500)   NULL,
        cor       CHAR(7)         NULL,
        lista_id  BIGINT          NOT NULL,
        CONSTRAINT FK_Cartao_Lista FOREIGN KEY (lista_id)
            REFERENCES dbo.Lista(id)
            ON DELETE CASCADE,
        CONSTRAINT CK_Cartao_Cor CHECK (
            cor IS NULL OR cor LIKE '#[0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f][0-9A-Fa-f]'
        )
    );
END;
GO

IF OBJECT_ID(N'dbo.Tarefa', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Tarefa (
        id             BIGINT          PRIMARY KEY,
        data_conclusao DATETIME2(0)    NOT NULL,
        CONSTRAINT FK_Tarefa_Cartao FOREIGN KEY (id)
            REFERENCES dbo.Cartao(id)
            ON DELETE CASCADE
    );
END;
GO

IF OBJECT_ID(N'dbo.Evento', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Evento (
        id          BIGINT          PRIMARY KEY,
        data_inicio DATETIME2(0)    NOT NULL,
        data_fim    DATETIME2(0)    NOT NULL,
        CONSTRAINT FK_Evento_Cartao FOREIGN KEY (id)
            REFERENCES dbo.Cartao(id)
            ON DELETE CASCADE,
        CONSTRAINT CK_Evento_Data CHECK (data_fim >= data_inicio)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Plano_Perfil' AND object_id = OBJECT_ID(N'dbo.Plano'))
BEGIN
    CREATE INDEX IX_Plano_Perfil ON dbo.Plano(perfil_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Lista_Plano' AND object_id = OBJECT_ID(N'dbo.Lista'))
BEGIN
    CREATE INDEX IX_Lista_Plano ON dbo.Lista(plano_id);
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Cartao_Lista' AND object_id = OBJECT_ID(N'dbo.Cartao'))
BEGIN
    CREATE INDEX IX_Cartao_Lista ON dbo.Cartao(lista_id);
END;
GO

IF OBJECT_ID(N'dbo.TR_Tarefa_Exclusiva', N'TR') IS NULL
BEGIN
    EXEC('CREATE TRIGGER dbo.TR_Tarefa_Exclusiva
          ON dbo.Tarefa
          AFTER INSERT, UPDATE
          AS
          BEGIN
              SET NOCOUNT ON;
              IF EXISTS (
                  SELECT 1
                  FROM inserted i
                  JOIN dbo.Evento e ON e.id = i.id
              )
                  THROW 50001, ''Cartão não pode ser Tarefa e Evento ao mesmo tempo.'', 1;
          END');
END;
GO

IF OBJECT_ID(N'dbo.TR_Evento_Exclusivo', N'TR') IS NULL
BEGIN
    EXEC('CREATE TRIGGER dbo.TR_Evento_Exclusivo
          ON dbo.Evento
          AFTER INSERT, UPDATE
          AS
          BEGIN
              SET NOCOUNT ON;
              IF EXISTS (
                  SELECT 1
                  FROM inserted i
                  JOIN dbo.Tarefa t ON t.id = i.id
              )
                  THROW 50001, ''Cartão não pode ser Tarefa e Evento ao mesmo tempo.'', 1;
          END');
END;
GO
