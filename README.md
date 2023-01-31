# Descrição da aplicação

Neste relatório foi criada uma aplicação com o nome de CMDB (Chelas Movie DataBase), que dá acesso, através de uma interface web, a algumas das funcionalidades fornecidas pelo site web IMDB (https://www.imdb.com/), fazendo uso da sua API Web para este fim: https://imdb-api.com/api/.

## Servidor

A aplicação contem um servidor responsável pela implementação da interface web, pelo armazenamento dos dados e pelas funcionalidades disponíveis aos clientes.
A aplicação do servidor consiste em 7 módulos:

-   cmdb-server.mjs - ficheiro que constitui o ponto de entrada para a aplicação do servidor.
-   cmdb-web-api.mjs - implementação das rotas HTTP que compõem a API da aplicação web.
-   cmdb-web-site.mjs – implementação das rotas HTTP que compõem a interface web da aplicação web.
-   cmdb-services.mjs - implementação da lógica de cada uma das funcionalidades da aplicação
-   imdb-movies-data.mjs - acesso à API do IMDB.
-   cmdb-data-db.mjs - acesso aos dados dos grupos, nesta versão guardados na base de dados do ElasticSearch.
-   cmdb-users-db.mjs - acesso aos dados dos utilizadores, nesta versão guardados na base de dados do ElasticSearch.

As dependências entre estes módulos são as seguintes:

`cmdb-server.mjs -> cmdb-web-api.mjs  -> cmdb-services.mjs -> imdb-movies-data.mjs`

`cmdb-server.mjs -> cmdb-web-api.mjs  -> cmdb-services.mjs -> cmdb-data-db.mjs`

`cmdb-server.mjs -> cmdb-web-api.mjs  -> cmdb-services.mjs -> cmdb-users-db.mjs`

`cmdb-server.mjs -> cmdb-web-site.mjs -> cmdb-services.mjs -> imdb-movies-data.mjs`

`cmdb-server.mjs -> cmdb-web-site.mjs -> cmdb-services.mjs -> cmdb-data-db.mjs`

`cmdb-server.mjs -> cmdb-web-site.mjs -> cmdb-services.mjs -> cmdb-users-db.mjs`

A aplicação do servidor também contém 3 módulos auxiliares:

-   errors.mjs – gerar códigos de erro e as mensagens associadas a estes.
-   errors-http.mjs – efetua a correspondência entre o erro gerado dentro do servidor e o código HTTP.
-   cmdb-handleResquest.mjs – efetua os pedidos os clientes.

As dependências entre estes módulos são as seguintes:

`cmdb-web-api.mjs  -> errors.mjs -> errors-https.mjs`

`cmdb-web-api.mjs  -> cmdb-handleRequest.mjs`

`cmdb-web-site.mjs -> errors.mjs -> errors-https`

`cmdb-web-site.mjs -> cmdb-handleRequest.mjs`

Também foram implementados os seguintes módulos, mas não estão a ser usados:

-   cmdb-data-mem.mjs - acesso aos dados dos grupos, nesta versão guardados em memória.
-   cmdb-users-mem.mjs - acesso aos dados dos utilizadores, nesta versão guardados em memória.

Estes módulos desempenham os mesmos papeis que cmdb-data-db.mjs e cmdb-users-db.mjs, exceto que os dados são guardados em memória, em vez da base de dados do ElasticSearch.

## Cliente

O cliente pode aceder à aplicação através de http:localhost:1350. Ao entrar no link, é apresentada a página inicial ou “home” da aplicação onde o utilizador pode efetuar login ou sign in, caso queira criar uma conta.
Após efetuar login, o cliente tem 3 menus que pode aceder:

-   Groups: Aqui o cliente pode criar, apagar e editar grupos. Estes grupos contêm uma lista de filmes que o cliente pode adicionar e a duração total dos filmes. É possível selecionar um dos filmes para ver mais detalhes e, se desejado, remover do grupo.
-   Top250Movies: É apresentada a lista dos 250 filmes com melhor classificação do IMDB. O cliente pode selecionar um dos filmes para ver mais detalhes sobre este e adicionar a um grupo.
-   Search: Apresenta uma lista de filmes baseado na palavra ou palavras pesquisadas. Novamente é possível selecionar um dos filmes para obter mais detalhes e adicionar a um grupo.

Caso queira sair da conta, o cliente pode efetuar logout.

# Armazenamento de Dados

O armazenamento dos dados da aplicação é efetuado no servidor do ElasticSearch.
Dentro do servidor, estão a ser utilizados dois índices:

-   users: Na criação de um novo utilizador, é adicionado um documento ao índice users onde está a ser armazenado a informação na forma de um objeto que contem o token, o id, a password, o username e email do utilizador. O token é gerado através da função crypto.randomUUID(). O id é uma variável que está a ser armazenada dentro do índice users no documento userIdx, sendo esta incrementada com cada novo utilizador. Os restantes são fornecidos pelo utilizador no formulário de sign.
-   groups: Na criação de um novo grupo, é necessário adicionar um documento ao índice groups com a informação na forma de um objeto que contem o id do grupo, o id do utilizador que criou o grupo e o título e a descrição e os filmes do grupo. O título e a descrição são fornecidos pelo utilizador na criação do grupo. Os filmes são acrescentados ao grupo quando o utilizador os adiciona. Os filmes são representados na forma de um Array que, para cada filme adicionado, é colocada a sua duração, titulo e o id. O id do grupo consiste numa variável que é adiciona dentro do índice groups no documento groupIdx, sendo esta incrementada com a criação de cada grupo.

# Mapeamento entre os documentos Cmdb do ElastictSearch e o modelo de objectos da aplicação web

Uma vez que, ao adicionar documentos à base de dados do Elastic, é sempre adicionada mais informação relativa ao documento do que a introduzida, quando pretendemos obter informação que está armazenada na base de dados, é necessário fazer uma filtragem da informação, de forma a obter apenas a útil. A melhor maneira de descobrir como fazer a correta filtragem da informação é fazer os pedidos no Postman e, de seguida, analisar a respostas aos pedidos.

### Pesquisas de documentos num índice usando a path `índice/_search`

-   É retornado um objeto com vários atributos, do qual é necessário aceder ao objeto `hits`, que por sua vez tem vários atributos, entre eles um array `hits`, que em cada índice tem um atributo `_source` que contém o objeto com a informação util.

### Pesquisas de um documento num índice usando a path `índice/_doc/id`

-   Quando se faz a pesquisa de um documento, usando o seu id, é retornado um objeto e, de forma a obter apenas a informação útil, é necessário aceder ao atributo `_source` do objeto retornado.

# Documentação do servidor API

GET: http://localhost:1350/api/movies/top250/

-   Descrição: Retorna um Array com os filmes com melhor classificação do IMDB, no máximo 250.
-   Parâmetros:
    -   limit: Parâmetro opcional, recebido por query, para limitar o número de filmes retornados (máx. 250).

GET: http://localhost:1350/api/movies/search/{name}

-   Descrição: Retorna uma lista de filmes resultantes da pesquisa pela String “name” fornecida.
-   Parâmetros:
    -   name: Nome a partir do qual a pesquisa é feita.
    -   limit: Parâmetro opcional, recebido por query, para limitar o número de filmes retornados (máx. 250).

GET: http://localhost:1350/api/movies

-   Descrição: Retorna os detalhes de um filme na forma do id, o título, a descrição, o URL da imagem, a duração, os realizadores e os atores.
-   Parâmetros:
    -   movieId: Recebido por body, Id do filme pretendido.

POST: http://localhost:1350/api/groups

-   Descrição: Cria um grupo com o nome e descrição dada.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   title: Recebido no body, título do grupo.
    -   description: Recebido no body, descrição do grupo.

PUT: http://localhost:1350/api/groups/{id}

-   Descrição: Edita um grupo, alterando o seu nome e/ou descrição dada.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   id: Id do grupo a ser editado.
    -   title: Recebido no body, título do grupo.
    -   description: Recebido no body, descrição do grupo.

GET: http://localhost:1350/api/groups/

-   Descrição: Retorna um Array com todos os grupos.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   id: Id do grupo a ser editado.
    -   title: Recebido no body, título do grupo.
    -   description: Recebido no body, descrição do grupo.

DELETE: http://localhost:1350/api/groups/{id}

-   Descrição: Elimina o grupo pretendido.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   id: Id do grupo a ser eliminado.

GET: http://localhost:1350/api/groups/{id}

-   Descrição: Retorna os detalhes do grupo pretendido, na forma do id, do título, da descrição, do Array de filmes e da duração total de filmes do grupo.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   id: Id do grupo pretendido.

POST: http://localhost:1350/api/groups/movies/{groupId}

-   Descrição: Adiciona o filme ao grupo pretendido.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   groupId: Id do grupo pretendido.
    -   movieId: Recebido no body, id do filme a adicionar.

DELETE: http://localhost:1350/api/groups/movies/{groupId}

-   Descrição: Elimina o filme do grupo pretendido.
-   Parâmetros:
    -   token: Token necessário para fazer o pedido.
    -   groupId: Id do grupo pretendido.
    -   movieId: Recebido no body, id do filme a eliminar.

POST: http://localhost:1350/api/users/

-   Descrição: Cria um novo utilizador.

GET: http://localhost:1350/api/users/

-   Descrição: Retorna a lista de utilizadores.
-   Nota: Esta chamada de API deve ser usada apenas em caso em debug. Não é para ser usada pelos clientes.

# Instruções para correr a aplicação

1. Instalar os packages necessários com o comando `npm install`.
2. Iniciar o servidor com o comando `node cmdb/cmdb-server.mjs`.
3. Enviar o pedido `Criar indice users e doc userIdx` na pasta `ElasticSearch/Users` no postman.
4. Enviar o pedido `Criar groups e groupIdx` na pasta `ElasticSearch/Groups` no postman.
5. Aceder a http://localhost:1350/.
6. Para correr os testes é necessário usar o comando `npm run test1`
