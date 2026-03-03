-- Adiciona coluna posicao na tabela Cartao para suportar ordenacao de cartoes dentro de listas
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.Cartao') AND name = 'posicao')
BEGIN
    ALTER TABLE dbo.Cartao ADD posicao INT NOT NULL CONSTRAINT DF_Cartao_posicao DEFAULT 0;
END;
GO

-- Inicializa posicao para cartoes existentes baseado no id (ordem de criacao)
;WITH CTE AS (
    SELECT id, lista_id, posicao,
           ROW_NUMBER() OVER (PARTITION BY lista_id ORDER BY id) - 1 AS nova_posicao
    FROM dbo.Cartao
)
UPDATE CTE SET posicao = nova_posicao;
GO
