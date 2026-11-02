# RPA - Cadastro de Clientes

Aplicação web estática para testes de cadastro e recepção de dados de clientes. Não requer banco de dados, servidor de aplicação ou instalação de dependências.

## Funcionalidades

- Cadastro de pessoa física (PF) ou jurídica (PJ).
- Campos para nome/razão social, CPF/CNPJ, CEP, estado e cidade.
- Confirmação obrigatória na tela de login de que o portal será usado apenas com dados fictícios para teste.
- Consulta dos cadastros na tabela, com opção de limpar registros.
- Armazenamento no `localStorage` do navegador.
- Interface adaptável e opções de tema.
- API JavaScript `window.RPA` para integração com automações na página.

## Como executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta no Visual Studio Code e inicie um servidor estático, por exemplo com a extensão **Live Server**.
3. Abra `templates/login.html` no navegador. Com Live Server, use o endereço local mostrado pela extensão, seguido de `/templates/login.html`.

Também é possível iniciar um servidor simples do Python na pasta raiz do projeto:

```powershell
py -m http.server 8000
```

Depois, abra <http://localhost:8000/templates/login.html>.

Login demonstrativo: usuário `admin`; a senha está configurada em `js/login.js`.

## Publicar com GitHub Pages

Nas configurações do repositório, habilite **Settings > Pages** e escolha a branch `main` e a pasta raiz (`/(root)`) como origem. Após a publicação, abra:

```text
https://willian837.github.io/rpa-cadastro-clientes/templates/login.html
```

## Avisos

- Este projeto é uma demonstração de front-end: o login `admin` e a senha definida em `js/login.js` são validados no próprio JavaScript e **não oferecem segurança real**. Não use senhas reais, dados pessoais ou informações confidenciais.
- A confirmação exibida no login é apenas um aviso de teste; não é consentimento, não registra uma base legal e não torna o sistema adequado para dados pessoais reais ou, por si só, compatível com a LGPD.
- Os registros são salvos somente no navegador e no perfil/origem do site em que foram criados. Não são enviados a um servidor, compartilhados com outros usuários ou sincronizados entre dispositivos. Limpar os dados do navegador pode apagá-los.
- A API `window.RPA` só fica disponível na página do painel depois do login de demonstração.

## Estrutura

```text
css/        Estilos da aplicação e do login
js/         Lógica do login, cadastro e API para automação
static/     Imagens e outros arquivos estáticos
templates/ Páginas de login e do painel
```
