-- Script para limpar emails duplicados no banco de dados
-- Este script mantém apenas o primeiro registro de cada email e remove os duplicados

-- IMPORTANTE: Faça um backup antes de executar este script!

-- Opção 1: Ver os emails duplicados antes de deletar
SELECT email, COUNT(*) as quantidade
FROM Perfil
GROUP BY email
HAVING COUNT(*) > 1;

-- Opção 2: Deletar registros duplicados, mantendo apenas o ID menor (primeiro cadastrado)
WITH CTE AS (
    SELECT 
        id,
        email,
        ROW_NUMBER() OVER(PARTITION BY email ORDER BY id ASC) as rn
    FROM Perfil
)
DELETE FROM Perfil
WHERE id IN (
    SELECT id FROM CTE WHERE rn > 1
);

-- Opção 3: Adicionar constraint UNIQUE ao campo email (execute após limpar duplicados)
-- ALTER TABLE Perfil ADD CONSTRAINT UK_Perfil_Email UNIQUE (email);

-- Verificar se ainda há duplicados
SELECT email, COUNT(*) as quantidade
FROM Perfil
GROUP BY email
HAVING COUNT(*) > 1;
