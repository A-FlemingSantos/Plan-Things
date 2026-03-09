-- Migrate senha column from VARBINARY(32) (SHA-256) to NVARCHAR(60) (BCrypt).
-- Existing password hashes are incompatible with BCrypt and cannot be converted;
-- they are replaced with a placeholder that will never match any BCrypt comparison,
-- so affected users must re-register or reset their password.

ALTER TABLE dbo.Perfil ADD senha_new NVARCHAR(60) NULL;
GO

UPDATE dbo.Perfil SET senha_new = '$MIGRATED$';
GO

ALTER TABLE dbo.Perfil DROP COLUMN senha;
GO

EXEC sp_rename 'dbo.Perfil.senha_new', 'senha', 'COLUMN';
GO

ALTER TABLE dbo.Perfil ALTER COLUMN senha NVARCHAR(60) NOT NULL;
GO
