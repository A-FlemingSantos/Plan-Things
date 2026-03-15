IF COL_LENGTH('dbo.Perfil', 'username') IS NULL
BEGIN
    ALTER TABLE dbo.Perfil ADD username VARCHAR(50) NULL;
END;
GO

UPDATE dbo.Perfil
SET username = CONCAT('user_', id)
WHERE username IS NULL OR LTRIM(RTRIM(username)) = '';
GO

IF EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Perfil')
      AND name = 'username'
      AND is_nullable = 1
)
BEGIN
    ALTER TABLE dbo.Perfil ALTER COLUMN username VARCHAR(50) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.key_constraints
    WHERE [type] = 'UQ'
      AND [name] = 'UQ_Perfil_Username'
      AND [parent_object_id] = OBJECT_ID(N'dbo.Perfil')
)
BEGIN
    ALTER TABLE dbo.Perfil
        ADD CONSTRAINT UQ_Perfil_Username UNIQUE (username);
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE [name] = 'IX_Perfil_Username'
      AND [object_id] = OBJECT_ID(N'dbo.Perfil')
)
BEGIN
    CREATE INDEX IX_Perfil_Username ON dbo.Perfil(username);
END;
GO

IF OBJECT_ID(N'dbo.PerfilAtivo', N'V') IS NOT NULL
BEGIN
    EXEC('ALTER VIEW dbo.PerfilAtivo AS
          SELECT id, email, username, nome, sobrenome, telefone
          FROM dbo.Perfil
          WHERE cod_status = 1');
END;
GO
