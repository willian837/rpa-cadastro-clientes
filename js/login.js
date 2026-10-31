(function () {
  'use strict';

  const LOGIN_KEY = 'portal_rpa_logado';
  const THEME_KEY = 'portal_rpa_theme';
  const LOGIN_USER = 'demo';
  const LOGIN_PASS = 'RpaTeste!Clientes-7fQ2';

  const loginForm = document.getElementById('loginForm');
  const loginUsuario = document.getElementById('loginUsuario');
  const loginSenha = document.getElementById('loginSenha');
  const loginError = document.getElementById('loginError');

  function init() {
    const tema = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
    document.body.classList.toggle('theme-dark', tema === 'dark');

    if (localStorage.getItem(LOGIN_KEY) === 'true') {
      window.location.replace('../templates/index.html');
      return;
    }

    loginForm.addEventListener('submit', autenticar);
  }

  function autenticar(event) {
    event.preventDefault();
    const usuario = loginUsuario.value.trim().toLowerCase();
    const senha = loginSenha.value.trim();

    if (usuario === LOGIN_USER && senha === LOGIN_PASS) {
      localStorage.setItem(LOGIN_KEY, 'true');
      window.location.replace('../templates/index.html');
      return;
    }

    loginError.textContent = 'Usuário ou senha inválidos.';
    loginError.classList.add('show');
    loginSenha.value = '';
    loginSenha.focus();
  }

  init();
})();
