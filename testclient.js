const axios = require('axios');

const testSOAP = async () => {
  const url = 'http://localhost:8000/musicService'; // URL do serviço
  const soapEnvelope = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mus="http://www.example.org/MusicService/">
    <soapenv:Header/>
    <soapenv:Body>
      <mus:listarUsuarios/>
    </soapenv:Body>
  </soapenv:Envelope>
`;


  try {
    const response = await axios.post(url, soapEnvelope, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'listarUsuarios',
        },
      });
    console.log('Resposta SOAP:', response.data); // Exibe o XML da resposta
  } catch (error) {
    console.error('Erro ao chamar o serviço:', error.message);
  }
};

testSOAP();
