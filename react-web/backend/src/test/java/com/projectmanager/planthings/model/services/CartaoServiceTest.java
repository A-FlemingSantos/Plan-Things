package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.repository.CartaoAtribuicaoRepository;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartaoServiceTest {

    @Mock
    private CartaoRepository cartaoRepository;

    @Mock
    private ListaRepository listaRepository;

    @Mock
    private CartaoAtribuicaoRepository cartaoAtribuicaoRepository;

    @Mock
    private PerfilRepository perfilRepository;

    @Mock
    private PlanoRepository planoRepository;

    @InjectMocks
    private CartaoService cartaoService;

    @Test
    void shouldNotAssignWhenTargetProfileIsNotActiveMemberOfCardPlan() {
        Cartao cartao = buildCartao(10L, 20L, 30L, 1L);
        Perfil actor = buildPerfil(1L, true);
        Perfil target = buildPerfil(2L, true);

        when(cartaoRepository.findByIdAndListaPlanoPerfilId(10L, 1L)).thenReturn(Optional.of(cartao));
        when(perfilRepository.findByIdAndCodStatusTrue(1L)).thenReturn(Optional.of(actor));
        when(perfilRepository.findAllById(List.of(2L))).thenReturn(List.of(target));
        when(planoRepository.existsByIdAndPerfilIdAndPerfilCodStatusTrue(30L, 1L)).thenReturn(true);
        when(planoRepository.existsByIdAndPerfilIdAndPerfilCodStatusTrue(30L, 2L)).thenReturn(false);

        assertThrows(BadRequestException.class,
                () -> cartaoService.assignProfiles(1L, 10L, List.of(2L), 1L));

        verify(cartaoAtribuicaoRepository, never()).saveAll(org.mockito.ArgumentMatchers.anyList());
    }

    private Cartao buildCartao(Long cartaoId, Long listaId, Long planoId, Long ownerPerfilId) {
        Perfil owner = buildPerfil(ownerPerfilId, true);

        Plano plano = new Plano();
        plano.setId(planoId);
        plano.setPerfil(owner);

        Lista lista = new Lista();
        lista.setId(listaId);
        lista.setPlano(plano);

        Cartao cartao = new com.projectmanager.planthings.model.entity.Tarefa();
        cartao.setId(cartaoId);
        cartao.setLista(lista);
        return cartao;
    }

    private Perfil buildPerfil(Long id, boolean ativo) {
        Perfil perfil = new Perfil();
        perfil.setId(id);
        perfil.setCodStatus(ativo);
        return perfil;
    }
}
