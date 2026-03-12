IF EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Perfil')
      AND name = 'senha'
      AND max_length < 100
)
BEGIN
    ALTER TABLE dbo.Perfil
        ALTER COLUMN senha VARBINARY(100) NOT NULL;
END;
GO
