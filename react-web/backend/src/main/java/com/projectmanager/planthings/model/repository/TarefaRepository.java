package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
	List<Tarefa> findByListaIdAndListaPlanoPerfilId(Long listaId, Long perfilId);

	Optional<Tarefa> findByIdAndListaPlanoPerfilId(Long id, Long perfilId);
}
