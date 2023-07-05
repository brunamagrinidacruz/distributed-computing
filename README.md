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

No frontend, foi usado o framework React para a construção das telas.

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

É recomendado o uso de Python Virtual Environment. Então para criá-lo e ativá-lo:
```
python3 -m venv venv
source venv/bin/activate
```

Em seguida, é necessário instalar as bibliotecas :
```
pip3 install -r requirements.txt
```

Por fim, colocar o ```.env``` na pasta /backend.

### Utilização
Para executar um servidor isolado, utilize `python3 app.py -n <server_name> -r <region> -p <port>`. 
Exemplo: 
```
python3 app.py -n AM1 -r AM -p 80
```
Para mais informações quanto a rodar o servidor, rode `python3 app.py -h`.

Por fim, para a aplicação funcionar conforme descrito anteriormente, é necessário criar 4 instâncias. Considerando que todas as instâncias estão em uma mesma máquina por simplicidade, elas podem ser criadas com os comandos:
```
python3 app.py -n AM1 -r AM -p 8081 &
python3 app.py -n AM2 -r AM -p 8082 &
python3 app.py -n EU1 -r EU -p 8083 & 
python3 app.py -n EU2 -r EU -p 8084 &
```
Se as instâncias estão em servidores diferentes, a mesma lógica pode ser aplicada apenas alterando o IP/Porta.

Para confirmar que tudo funcionou, utilize:
```
curl 127.0.0.1:[porta]/ping
```
Observação: No caso de servidores com dígito par (como AM2), a requisição para ```/ping``` possui um atraso de 15 segundos para simular uma requisição com bastante carga.

## Reverse Proxy & Load Balancer

Os comandos foram descritos considerando que o sistema operacional é o Ubuntu, caso seja diferente, é necessário utilizar o comando análogo para a distribuição correspondente.

### Instalação 

Para instalar, use o comando:
```
apt install nginx
```

Para a instalação do GeoIP2, o módulo dinâmico de redirecionamento geográfico, seguiu-se os seguintes tutoriais:
[tutorial 1](https://dokov.bg/nginx-geoip2) e [tutorial 2](https://medium.com/@maxime.durand.54/add-the-geoip2-module-to-nginx-f0b56e015763).

Primeiro, deve-se executar o seguinte comando:
```
sudo add-apt-repository ppa:maxmind/ppa

sudo apt update
sudo apt install geoipupdate libmaxminddb0 libmaxminddb-dev mmdb-bin
```

Após isso, é necessário criar uma conta no site da [MaxMind](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) e gerar uma license key para a versão Lite do GeoIP2 que é grátis, porém menos precisa.

No arquivo `/etc/GeoIP.conf`, deverá editar o AccountID e o LicenseKey:
```
# /etc/GeoIP.conf
# Replace YOUR_ACCOUNT_ID_HERE and YOUR_LICENSE_KEY_HERE with an active account
# ID and license key combination associated with your MaxMind account. These
# are available from https://www.maxmind.com/en/my_license_key.
AccountID YOUR_ACCOUNT_ID_HERE
LicenseKey YOUR_LICENSE_KEY_HERE

# Enter the edition IDs of the databases you would like to update.
# Multiple edition IDs are separated by spaces.
EditionIDs GeoLite2-ASN GeoLite2-City GeoLite2-Country
```

Após isso deverá executar o comando a seguir para aplicar as configurações:
```
sudo geoipupdate
```
E adicionar um cron job para permitir updates diários:
```
sudo crontab -e
# Run GeoIP database update all the thuesday at 02:00
0 2 * * 2 /usr/bin/geoipupdate
```

A partir daí segue-se integralmente o [seguinte tutorial](https://dokov.bg/nginx-geoip2).

```
load_module modules/ngx_http_geoip2_module.so;

http {
    geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
        auto_reload 60m;
        $geoip2_metadata_country_build metadata build_epoch;
        $geoip2_data_continent_code continent code;
    }

    ...
    ...
    ...

    map $geoip2_data_continent_code $nearest_server {
        EU      eu;
        NA      am;
        SA      am;
    }
}
```

A seguinte configuração foi usada para utilizar o GeoIP2 para distribuir as requisições de acordo com o IP do request. Como pode ser visto, a partir do Continent Code, foi criado um `map` em que os codes NA e SA do GeoIP2 foram relacionados ao upstream am, enquanto EU foi relacionado ao upstream eu.

### Utilização

Altere o arquivo nginx.conf disponibilizado em /backend conforme necessário. Por exemplo, caso as 4 instâncias da aplicação estejam na mesma máquina (conforme demonstrado na seção anterior) do Nginx, altere o IP/Porta conforme a seguir:
```
upstream am {
	least_conn;
	server 127.0.0.1:8081;
	server 127.0.0.1:8082;
}

upstream eu {
	least_conn;
	server 127.0.0.1:8083;
	server 127.0.0.1:8084;
}
```

Em seguida, reinicie o Nginx:
```
systemctl restart nginx
```

Com isso, o Nginx funciona como Reverse Proxy e Load Balancer. Para confirmar se tudo funcionou, faça múltplas chamadas ao Nginx e confirme se são direcionadas para diferentes servidores: 
```
curl 127.0.0.1:80/ping
```

Observação: Caso o Nginx não esteja na mesma máquina que as instâncias, é necessário alterar no arquivo ```.env``` de cada aplicação o IP do Nginx para que elas aceitem requisição dele. Esta configuração é feita através da variável ```REVERSE_PROXY_IP```.

## Front-end

### Instalação

Parar instalar o app, é necessário apenar possuir o `npm` instalado na máquina. Uma vez instalado,
basta rodar o comando:

```shell
npm install
```

### Utilização

Para executar a aplicação, basta usar o comando do `npm`:

```shell
npm start
```

A aplicação deve abrir no browser. Caso o usuário não tenha uma conta, basta criar uma na seção
Register e logar na Login. Após isso, o usuário pode acessar a sua Pokedex, obter seu Pokemon
diário ou ver os usuários cadastrados naquela região.

## Integrantes
Nome    | Número USP
--------|-----------
Bruna Magrini da Cruz | 11218813
Gabriel Freitas Ximenes de Vasconcelos | 11819084
Otto Cruz Fernandes | 11275130
Raíssa Torres Barreira | 11796336
Yasmin Osajima de Araújo | 11219004
