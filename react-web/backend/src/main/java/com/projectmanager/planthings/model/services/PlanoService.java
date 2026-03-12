package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.dto.CartaoResponse;
import com.projectmanager.planthings.model.dto.PlanoBoardListaResponse;
import com.projectmanager.planthings.model.dto.PlanoBoardResponse;
import com.projectmanager.planthings.model.dto.PlanoResponse;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class PlanoService {

    private static final int MAX_WALLPAPER_REFERENCE_LENGTH = 2048;
    private static final String DATA_URL_PREFIX = "data:";

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private CartaoRepository cartaoRepository;

    public List<Plano> findAllByPerfilId(Long perfilId) {
        ensurePerfilAtivo(perfilId);
        return planoRepository.findByPerfilId(perfilId);
    }

    public Plano findById(Long perfilId, Long id) {
        ensurePerfilAtivo(perfilId);
        return planoRepository.findByIdAndPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado para o perfil informado"));
    }

    public Plano save(Long perfilId, Plano plano) {
        Perfil perfil = ensurePerfilAtivo(perfilId);
        validateWallpaperReference(plano.getWallpaperUrl(), null);
        plano.setId(null);
        plano.setPerfil(perfil);
        return Objects.requireNonNull(planoRepository.save(plano));
    }

    public Plano update(Long perfilId, Long id, Plano plano) {
        Plano existente = findById(perfilId, id);
        validateWallpaperReference(plano.getWallpaperUrl(), existente.getWallpaperUrl());
        existente.setNome(plano.getNome());
        existente.setWallpaperUrl(plano.getWallpaperUrl());
        return Objects.requireNonNull(planoRepository.save(existente));
    }

    public void delete(Long perfilId, Long id) {
        Plano existente = findById(perfilId, id);
        planoRepository.delete(Objects.requireNonNull(existente));
    }

    @Transactional(readOnly = true)
    public PlanoBoardResponse findBoardById(Long perfilId, Long id) {
        Plano plano = findById(perfilId, id);
        List<Lista> listas = listaRepository.findByPlanoIdAndPlanoPerfilId(id, perfilId);
        List<Cartao> cartoes = cartaoRepository.findByListaPlanoIdAndListaPlanoPerfilIdOrderByListaIdAscPosicaoAsc(id, perfilId);

        Map<Long, List<CartaoResponse>> cartoesPorLista = new LinkedHashMap<>();
        for (Cartao cartao : cartoes) {
            Long listaId = cartao.getLista() != null ? cartao.getLista().getId() : null;
            if (listaId == null) {
                continue;
            }

            cartoesPorLista
                    .computeIfAbsent(listaId, ignored -> new ArrayList<>())
                    .add(toCartaoResponse(cartao));
        }

        List<PlanoBoardListaResponse> listasResponse = new ArrayList<>();
        for (Lista lista : listas) {
            listasResponse.add(new PlanoBoardListaResponse(
                    lista.getId(),
                    lista.getNome(),
                    lista.getCor(),
                    plano.getId(),
                    cartoesPorLista.getOrDefault(lista.getId(), List.of())
            ));
        }

        return new PlanoBoardResponse(toPlanoResponse(plano), listasResponse);
    }

    private Perfil ensurePerfilAtivo(Long perfilId) {
        return perfilRepository.findByIdAndCodStatusTrue(perfilId)
                .orElseThrow(() -> new NotFoundException("Perfil ativo não encontrado"));
    }

    private void validateWallpaperReference(String wallpaperUrl, String existingWallpaperUrl) {
        if (wallpaperUrl == null || wallpaperUrl.isBlank()) {
            return;
        }

        boolean isExistingLegacyWallpaper = existingWallpaperUrl != null && existingWallpaperUrl.equals(wallpaperUrl);
        if (isExistingLegacyWallpaper) {
            return;
        }

        if (wallpaperUrl.startsWith(DATA_URL_PREFIX)) {
            throw new BadRequestException("Imagens incorporadas em base64 não são mais aceitas. Use uma capa predefinida.");
        }

        if (wallpaperUrl.length() > MAX_WALLPAPER_REFERENCE_LENGTH) {
            throw new BadRequestException("Wallpaper deve armazenar apenas uma referência curta de até 2048 caracteres.");
        }
    }

    private PlanoResponse toPlanoResponse(Plano plano) {
        return new PlanoResponse(
                plano.getId(),
                plano.getNome(),
                plano.getWallpaperUrl(),
                plano.getPerfil() != null ? plano.getPerfil().getId() : null
        );
    }

    private CartaoResponse toCartaoResponse(Cartao cartao) {
        String tipo = "CARTAO";
        java.time.LocalDateTime dataConclusao = null;
        java.time.LocalDateTime dataInicio = null;
        java.time.LocalDateTime dataFim = null;

        if (cartao instanceof Tarefa tarefa) {
            tipo = "TAREFA";
            dataConclusao = tarefa.getDataConclusao();
        } else if (cartao instanceof Evento evento) {
            tipo = "EVENTO";
            dataInicio = evento.getDataInicio();
            dataFim = evento.getDataFim();
        }

        return new CartaoResponse(
                cartao.getId(),
                tipo,
                cartao.getNome(),
                cartao.getDescricao(),
                cartao.getCor(),
                cartao.getLista() != null ? cartao.getLista().getId() : null,
                cartao.getPosicao(),
                dataConclusao,
                dataInicio,
                dataFim
        );
    }
}
