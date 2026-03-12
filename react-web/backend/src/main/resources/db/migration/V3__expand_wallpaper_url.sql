-- Expand wallpaper_url to VARCHAR(MAX) to support longer predefined cover references
ALTER TABLE dbo.Plano ALTER COLUMN wallpaper_url VARCHAR(MAX) NULL;
