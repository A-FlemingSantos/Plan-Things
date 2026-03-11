-- Expand wallpaper_url to support base64 data-URL cover images
ALTER TABLE dbo.Plano ALTER COLUMN wallpaper_url VARCHAR(MAX) NULL;
