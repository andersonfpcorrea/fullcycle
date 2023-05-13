# API Tools usada no módulo de Comunicação do curso FullCycle

## Rodar a aplicação

Rode o comando

`docker build -t api-tools-test . && docker run -p 8000:80 -v $(pwd):/var/www api-tools-test`

Acessar `http://localhost:8000` para testar o projeto.
