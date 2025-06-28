
## Descrição do Projeto

O **Dexes** é um web site destinado a facilitar a divulgação dos projetos e a comunicação eficiente entre profissionais das principais áreas da tecnologia e investidores interessados nos projetos, abrangendo desde iniciantes até especialistas. O objetivo é garantir que os usuários possam adquirir reconhecimento aos seus projetos e aprimorar suas competências por meio de uma rede colaborativa.

O site possui diversas funcionalidades, como um chat para comunicação direta entre os usuários, possibilitando uma troca rápida e eficiente de informações. Cada usuário pode criar, editar e excluir seu perfil pessoal, onde será possível compartilhar informações sobre sua experiência e interesses profissionais. Junto com o perfil, há um portfólio para divulgar os projetos realizados e os serviços prestados, além de permitir a adição de feedbacks sobre os trabalhos executados.

Para encontrar outros profissionais e investidores, há uma aba de pesquisa, onde os usuários podem procurar por projetos e ideias de projetos. E, ao clicar no botão “Especialização”, o usuário ou investidor será direcionado para questionários que ajudarão a definir a área em que deseja negociar, trabalhar e investir, facilitando a conexão com os profissionais e negociadores mais qualificados.

Siga-nos no Instagram para acompanhar as novidades: [@dexes_project](https://www.instagram.com/dexes_project?igsh=MXg1NzM1cG9icDRwMA==).

## Requisitos do Sistema

### Requisitos Funcionais (RF)


| Código      | Requisito Funcional                                                                 | Descrição                                                                                      |
|-------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| **RF 001**  | O sistema deve permitir que o usuário realize seu cadastro perfeitamente.           | Página de cadastro para novos usuários.                                                       |
| **RF 002**  | O sistema deve permitir que o usuário investidor realize seu cadastro.              | Página de cadastro para novos investidores.                                                   |
| **RF 003**  | O sistema deve permitir login via Gmail.                                            | Integração com a API de login do Google.                                                      |
| **RF 004**  | O sistema deve permitir modificação do perfil.                                      | Funcionalidades para editar foto, nome, biografia, entre outros.                              |
| **RF 005**  | O sistema deve permitir o cadastro de projetos.                                     | Citação da proposta e informações do projeto, como nome, logo, participantes, etc.            |
| **RF 006**  | O sistema deve permitir edição e exclusão de projetos.                              | Edição da logo, nome, descrição, proposta, participantes da equipe, entre outros.             |
| **RF 007**  | O sistema deve ter um chat.                                                         | Chat para comunicação entre usuários, com envio de vídeos, imagens e links.                   |
| **RF 008**  | O sistema deve ter uma aba de pesquisa.                                             | Pesquisa de projetos e ideias de projetos.                                                    |
| **RF 009**  | O sistema deve exibir projetos feitos pelo profissional.                            | No perfil do usuário profissional, mostrar os projetos criados.                               |
| **RF 010**  | O sistema deve ter uma função de especificação de projetos procurados.              | Questionários para recomendar projetos ou ideias com base nas respostas.                      |
| **RF 011**  | O sistema permitirá postagens na comunidade e perfil.                               | Postagens relacionadas a imagens e links.                                                     |
| **RF 012**  | O sistema deve permitir feedbacks.                                                  | Avaliação de projetos e usuários, com comentários.                                            |
## Colaboradores do Projeto e as funções que irão exercer

| Integrantes da equipe | Requisitos Funcionais (RF)                |
|-----------------------|-------------------------------------------|
| Ana Carolina          | [RF 002], [RF 005], [RF 007], [RF 008]    |
| Gabriel Castanhel     | [RF 001], [RF 003], [RF 004], [RF 012]    |
| Pedro Henrique        | [RF 006], [RF 009], [RF 010], [RF 011]    |
## Protótipo das Telas de Login e Cadastro

### Tela de Login
![Login](./3-fase-sa/public/img/Login.png)

### Tela de Cadastro  Investidor
![Cadastro_investidor](./3-fase-sa/public/img/Tela_cadastro_investidor.png)

### Tela de Cadastro  Profissional (Parte 1)
![Cadastro](./3-fase-sa/public/img/Tela_cadastro_profissional_1.png)

### Tela de Cadastro (Parte 2 - Seleção de Experiência e Área)
![Cadastro 2](./3-fase-sa/public/img/Tela_cadastro_profissional_2.png)

### Tela de Cadastro (Parte 3 - Seleção de softwares e Linguagens de programação)
![Cadastro 3](./3-fase-sa/public/img/Tela_cadastro_prossional_3.png)

### Instalações das bibliotecas do backend

# Passo 1: 
instalar o python: https://www.python.org/downloads/

![Captura de tela 2025-06-28 114846](https://github.com/user-attachments/assets/cc11915a-699f-4c49-a4b6-ffe2302f451d)

![Captura de tela 2025-06-28 115147](https://github.com/user-attachments/assets/b9cdfccd-f074-4063-a2a7-e4e202c7b824)


```bash
pip install flask python-dotenv flask-cors flask-socketio pymongo bcrypt requests google-auth werkzeug
```


