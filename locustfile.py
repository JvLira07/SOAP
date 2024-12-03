from locust import HttpUser, TaskSet, task, between
import xml.etree.ElementTree as ET

class TesteCargaSOAP(TaskSet):

    def criar_soap_envelope(self, operacao):
        # Cria o envelope SOAP básico para qualquer operação
        envelope = ET.Element("soapenv:Envelope", xmlns_soapenv="http://schemas.xmlsoap.org/soap/envelope/", xmlns_web="http://www.example.org/MusicStreamingService/")
        body = ET.SubElement(envelope, "soapenv:Body")
        operacao_element = ET.SubElement(body, f"web:{operacao}")
        return ET.tostring(envelope, encoding="utf-8")

    @task
    def listar_usuarios(self):
        # Envia uma requisição SOAP para listar usuários
        soap_request = self.criar_soap_envelope("listarUsuarios")
        with self.client.post(
            "/soap",
            data=soap_request,
            headers={"Content-Type": "text/xml;charset=UTF-8"},
            name="SOAP - listarUsuarios",
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure(f"Erro ao acessar listarUsuarios! Status: {response.status_code}")

    @task
    def listar_musicas(self):
        # Envia uma requisição SOAP para listar músicas
        soap_request = self.criar_soap_envelope("listarMusicas")
        with self.client.post(
            "/soap",
            data=soap_request,
            headers={"Content-Type": "text/xml;charset=UTF-8"},
            name="SOAP - listarMusicas",
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure(f"Erro ao acessar listarMusicas! Status: {response.status_code}")


class UsuarioSimulado(HttpUser):
    tasks = [TesteCargaSOAP]
    wait_time = between(1, 3)  # Espera entre 1 e 3 segundos entre as requisições
