# Projeto - Sistemas Distribuídos

Esse projeto visa aplicar os conceitos aprendidos na disciplina **SSC0904 - Sistemas Computacionais Distribuídos**.

## Ideia

Criamos uma aplicação web simples com front-end e back-end em que o usuário pode acumular diferentes pokemóns para sua coleção.

O foco da aplicação foi construir uma estrutura de back-end distribuída. Para isso, alocamos quatro hosts, de forma que cada host atende um servidor. Dois servidores serão para a América e os outros dois serão para a Europa. Essa distribuição das requisições será feito a partir do endereço IP.  
A carga de cada uma dessas regiões será distribuída entre os dois servidores por um Load Balancer utilizando a configuração de Least Connections, no qual a requisição é enviada para o servidor com o menor número de conexões ativas. A transparência de acesso e localização será responsabilidade dos Reverse Proxies que estão na infraestrutura.   
A infraestrutura do sistema pode ser vista abaixo:

![Diagrama da infraestrutura do sistema](images/diagrama_arquitetura.png)

## Tecnologias
Para fazer os servidores, utilizamos a biblioteca Flask do Python.

Foi utilizado o MongoDB como SGBD do nosso sistema. A arquitetura do banco de dados pode ser vista abaixo:

    User {
		username: String, UNIQUE 1
		email: String, UNIQUE 2
		password: BinData,
		region: String ENUM
	}

	UserPokemon {
		pokemon: Number, 
		user_id: ObjectID, UNIQUE 1
		date: Date, UNIQUE 1
	}

Utilizamos o NGINX para os Load Balancers e para o Reverse Proxy.

As máquinas virtuais em que os servidores estão hospedados são do DigitalOcean, sendo:
Descrição    | Caminho
--------|-----------
Nginx/Aplicação | 161.35.30.200
AM-1 | 64.226.125.28:8080
AM-2 | 64.226.109.169:8080
EU-1 | 206.81.20.72:8080
EU-2 | 64.226.106.15:8080

Observação: As aplicações só aceitam requisições encaminhadas pelo Nginx, então não é possível acessar diretamente cada uma. Para realizar o teste, acesse http://161.35.30.200/ping. 

## Back-end

### Instalação

É recomendado o uso de Python Virtual Envirorment. Então para criá-lo e ativá-lo:
```
python3 -m venv venv
source venv/bin/activate
```

### Utilização
Para utilizar o site, acesse o link [colocar aqui].

Para executar um servidor isolado, utilize `python3 app.py -n <server_name> -r <region> -p <port>`. Exemplo: `python3 app.py -n AM1 -r AM -p 80`.  
Para mais informações quanto a rodar o servidor, rode `python3 app.py -h`.

[etc]

## Front-end

### Instalação

...

### Utilização

...

## Integrantes
Nome    | Número USP
--------|-----------
Bruna Magrini da Cruz | 11218813
Gabriel Freitas Ximenes de Vasconcelos | 11819084
Otto Cruz Fernandes | 11275130
Raíssa Torres Barreira | 11796336
Yasmin Osajima de Araújo | 11219004
