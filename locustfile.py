from locust import HttpUser, task, between

class MusicStreamingUser(HttpUser):
    wait_time = between(1, 5)  # Intervalo entre as requisições

    # Função para testar o endpoint de listarUsuários
    @task
    def listar_usuarios(self):
        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "listarUsuarios",
        }
        body = """
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:web="http://www.example.org/MusicStreamingService/">
            <soapenv:Header/>
            <soapenv:Body>
                <web:listarUsuarios/>
            </soapenv:Body>
        </soapenv:Envelope>
        """
        # Fazendo o POST com a requisição SOAP
        self.client.post("/soap", data=body, headers=headers)

    # Função para testar o endpoint de listarMusicas
    @task
    def listar_musicas(self):
        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "listarMusicas",
        }
        body = """
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:web="http://www.example.org/MusicStreamingService/">
            <soapenv:Header/>
            <soapenv:Body>
                <web:listarMusicas/>
            </soapenv:Body>
        </soapenv:Envelope>
        """
        # Fazendo o POST com a requisição SOAP
        self.client.post("/soap", data=body, headers=headers)
