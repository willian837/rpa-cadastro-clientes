/**
 * Portal de Recepção de Dados - Automação RPA
 * Sem banco de dados (armazenamento em memória / sessão local)
 * Inicia completamente VAZIO para receber os dados do seu robô.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'portal_rpa_clientes_vazio';
  const LOGIN_KEY = 'portal_rpa_logado';
  const THEME_KEY = 'portal_rpa_theme';

  let clientes = [];

  const btnLogout = document.getElementById('btn_logout');
  const btnThemeToggle = document.getElementById('btn_theme_toggle');

  const formCliente = document.getElementById('form_cliente');
  const tipoCliente = document.getElementById('tipocliente') || document.getElementById('tipo_cliente');
  const nomeCliente = document.getElementById('nomerazaosocial') || document.getElementById('nome_cliente');
  const cpfCnpj = document.getElementById('cpfcnpj') || document.getElementById('cpf_cnpj');
  const cepInput = document.getElementById('cep');
  const estadoSelect = document.getElementById('estado');
  const cidadeInput = document.getElementById('cidade');

  const btnAdicionar = document.getElementById('botaoadicionarcliente') || document.getElementById('btn_adicionar');
  const btnLimparCampos = document.getElementById('btn_limpar_campos');
  const btnLimparTudo = document.getElementById('btn_limpar_tudo');
  const corpoTabela = document.getElementById('corpo_tabela');
  const emptyPlaceholder = document.getElementById('empty_placeholder');
  const clientesCountBadge = document.getElementById('clientes_count');
  const feedbackMsg = document.getElementById('feedback_message');

  function init() {
    if (localStorage.getItem(LOGIN_KEY) !== 'true') {
      window.location.replace('../templates/login.html');
      return;
    }

    localStorage.removeItem('rpa_dev_studio_clientes');

    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        clientes = JSON.parse(salvo);
      } else {
        clientes = [];
      }
    } catch (e) {
      clientes = [];
    }

    aplicarTema(localStorage.getItem(THEME_KEY) || 'light');
    configurarEventos();
    renderizarTabela();
    exporAPIParaRobo();
  }

  function aplicarTema(tema) {
    const temaAtual = tema === 'dark' ? 'dark' : 'light';
    document.body.classList.toggle('theme-dark', temaAtual === 'dark');
    if (btnThemeToggle) {
      btnThemeToggle.classList.toggle('is-light', temaAtual === 'light');
    }
    localStorage.setItem(THEME_KEY, temaAtual);
  }

  function deslogar() {
    localStorage.removeItem(LOGIN_KEY);
    window.location.replace('../templates/login.html');
  }

  function salvarStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    } catch (e) {
      console.warn('Erro ao salvar no storage local:', e);
    }
  }

  function exibirFeedback(texto, tipo = 'success') {
    feedbackMsg.textContent = texto;
    feedbackMsg.className = `toast-feedback show ${tipo}`;
    setTimeout(() => {
      feedbackMsg.className = 'toast-feedback';
    }, 3000);
  }

  function renderizarTabela() {
    corpoTabela.innerHTML = '';
    clientesCountBadge.textContent = clientes.length;

    if (clientes.length === 0) {
      emptyPlaceholder.style.display = 'flex';
      return;
    }

    emptyPlaceholder.style.display = 'none';

    clientes.forEach((cli, idx) => {
      const tr = document.createElement('tr');

      // Tipo badge
      const isPJ = (cli.tipo || '').toUpperCase().includes('PJ');
      const badgeClass = isPJ ? 'badge-pj' : 'badge-pf';
      const badgeTexto = isPJ ? 'PJ' : 'PF';

      tr.innerHTML = `
        <td><span class="${badgeClass}">${badgeTexto}</span></td>
        <td><strong>${escapeHtml(cli.nome || '')}</strong></td>
        <td><span class="doc-mono">${escapeHtml(cli.cpf_cnpj || '-')}</span></td>
        <td><span class="doc-mono">${escapeHtml(cli.cep || '-')}</span></td>
        <td><span class="badge-uf">${escapeHtml(cli.estado || '-')}</span></td>
        <td>${escapeHtml(cli.cidade || '')}</td>
      `;

      corpoTabela.appendChild(tr);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function adicionarRegistro(dados, limparFormulario = true) {
    if (!dados.tipo || !dados.nome) {
      exibirFeedback('Preencha os campos obrigatórios (Tipo e Nome).', 'error');
      return false;
    }

    const novo = {
      tipo: String(dados.tipo).trim(),
      nome: String(dados.nome).trim(),
      cpf_cnpj: String(dados.cpf_cnpj || '').trim(),
      cep: String(dados.cep || '').trim(),
      estado: String(dados.estado || '').trim(),
      cidade: String(dados.cidade || '').trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR')
    };

    clientes.push(novo);
    salvarStorage();
    renderizarTabela();

    // Rola a tabela para a linha mais recente
    const wrapper = document.querySelector('.table-wrapper');
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight;
    }

    if (limparFormulario) {
      formCliente.reset();
      tipoCliente.value = '';
      estadoSelect.value = '';
      tipoCliente.focus();
    }

    exibirFeedback(`Cliente "${novo.nome}" cadastrado com sucesso!`, 'success');
    return true;
  }

  function removerRegistro(index) {
    if (index >= 0 && index < clientes.length) {
      const removido = clientes.splice(index, 1)[0];
      salvarStorage();
      renderizarTabela();
      exibirFeedback(`Registro "${removido.nome}" removido.`, 'success');
    }
  }

  function limparTudo() {
    if (clientes.length === 0) return;
    clientes = [];
    salvarStorage();
    renderizarTabela();
    exibirFeedback('Todos os registros foram removidos.', 'success');
  }

  function limparCampos() {
    formCliente.reset();
    tipoCliente.focus();
    exibirFeedback('Campos do formulário limpos.', 'success');
  }

  function configurarEventos() {
    btnLogout.addEventListener('click', deslogar);
    btnThemeToggle.addEventListener('click', function () {
      const atual = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
      aplicarTema(atual === 'light' ? 'dark' : 'light');
    });

    formCliente.addEventListener('submit', function (e) {
      e.preventDefault();
      const dados = {
        tipo: tipoCliente.value,
        nome: nomeCliente.value,
        cpf_cnpj: cpfCnpj.value,
        cep: cepInput.value,
        estado: estadoSelect.value,
        cidade: cidadeInput.value
      };
      adicionarRegistro(dados, true);
    });

    btnLimparTudo.addEventListener('click', limparTudo);
    btnLimparCampos.addEventListener('click', limparCampos);
  }

  // Permite que ferramentas de automação também interajam via JS se desejado
  function exporAPIParaRobo() {
    window.RPA = {
      adicionar: function (tipo, nome, cpf_cnpj, cep, estado, cidade) {
        return adicionarRegistro({ tipo, nome, cpf_cnpj, cep, estado, cidade }, false);
      },
      obterCadastros: function () {
        return [...clientes];
      },
      limpar: function () {
        limparTudo();
      },
      total: function () {
        return clientes.length;
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
