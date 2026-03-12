-- Expand wallpaper_url to support longer predefined cover references
ALTER TABLE Plano ALTER COLUMN wallpaper_url VARCHAR(1048576);
