package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
	List<Evento> findByListaIdAndListaPlanoPerfilId(Long listaId, Long perfilId);

	Optional<Evento> findByIdAndListaPlanoPerfilId(Long id, Long perfilId);
}
