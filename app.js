const soap = require('soap');
const http = require('http');

// Dados em memória com usuários fictícios
const data = {
  usuarios: [
    { id: 1, nome: 'João Silva', email: 'joao.silva@example.com' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@example.com' },
    { id: 3, nome: 'Carlos Souza', email: 'carlos.souza@example.com' },
    { id: 4, nome: 'Ana Pereira', email: 'ana.pereira@example.com' },
  ],
  musicas: [],
  playlists: [],
};

// Funções do Serviço
const musicService = {
  MusicService: {
    MusicServiceSoap: {
      // Listar usuários
      listarUsuarios: function (args, callback) {
        console.log("Função listarUsuarios foi chamada!");
        console.log("Dados dos usuários:", data.usuarios);
      
        // Verifica se há usuários
        if (data.usuarios.length === 0) {
          console.log("Nenhum usuário encontrado!");
          callback(null, { usuarios: [] });
          return;
        }
      
        // Responde com os dados dos usuários
        callback(null, { usuarios: data.usuarios });
      },

      // Listar músicas
      listarMusicas: function (_, callback) {
        console.log("listarMusicas foi chamado!");
        callback(null, { musicas: data.musicas });
      },

      // Listar playlists de um usuário
      listarPlaylistsPorUsuario: function ({ usuarioId }, callback) {
        const playlists = data.playlists.filter(
          (playlist) => playlist.usuarioId === usuarioId
        );
        callback(null, { playlists });
      },

      // Listar músicas de uma playlist
      listarMusicasPorPlaylist: function ({ playlistId }, callback) {
        const playlist = data.playlists.find((p) => p.id === playlistId);
        if (!playlist) {
          callback({ message: 'Playlist não encontrada.' }, null);
        } else {
          const musicas = playlist.musicas.map((musicaId) =>
            data.musicas.find((musica) => musica.id === musicaId)
          );
          callback(null, { musicas });
        }
      },

      // Listar playlists que contêm uma música
      listarPlaylistsPorMusica: function ({ musicaId }, callback) {
        const playlists = data.playlists.filter((playlist) =>
          playlist.musicas.includes(musicaId)
        );
        callback(null, { playlists });
      },
    },
  },
};

// Definição do WSDL como string
const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="MusicService"
  targetNamespace="http://localhost:8000/musicService"
  xmlns:tns="http://localhost:8000/musicService"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
  xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <!-- Esquema XML -->
 <types>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://localhost:8000/musicService">
    <!-- Solicitação para listar usuários -->
    <xs:element name="listarUsuariosRequest"/>

    <!-- Resposta para listar usuários -->
    <xs:element name="listarUsuariosResponse">
      <xs:complexType>
        <xs:sequence>
          <xs:element name="usuarios">
            <xs:complexType>
              <xs:sequence>
                <xs:element name="usuario" minOccurs="0" maxOccurs="unbounded">
                  <xs:complexType>
                    <xs:sequence>
                      <xs:element name="id" type="xs:int"/>
                      <xs:element name="nome" type="xs:string"/>
                    </xs:sequence>
                  </xs:complexType>
                </xs:element>
              </xs:sequence>
            </xs:complexType>
          </xs:element>
        </xs:sequence>
      </xs:complexType>
    </xs:element>

    <!-- Solicitação para listar músicas -->
    <xs:element name="listarMusicasRequest"/>
    <xs:element name="listarMusicasResponse">
      <xs:complexType>
        <xs:sequence>
          <xs:element name="musicas" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
        </xs:sequence>
      </xs:complexType>
    </xs:element>
  </xs:schema>
</types>

  <!-- Mensagens -->
  <message name="listarUsuariosRequest"/>
  <message name="listarUsuariosResponse">
    <part name="usuarios" element="tns:listarUsuariosResponse"/>
  </message>

  <message name="listarMusicasRequest"/>
  <message name="listarMusicasResponse">
    <part name="musicas" element="tns:listarMusicasResponse"/>
  </message>

  <!-- Port Type -->
  <portType name="MusicServicePortType">
    <operation name="listarUsuarios">
  <soap:operation soapAction="listarUsuarios"/>
  <input message="tns:listarUsuariosRequest"/>
  <output message="tns:listarUsuariosResponse"/>
</operation>

    <operation name="listarMusicas">
      <input message="tns:listarMusicasRequest"/>
      <output message="tns:listarMusicasResponse"/>
    </operation>
  </portType>

  <!-- Binding -->
  <binding name="MusicServiceSoapBinding" type="tns:MusicServicePortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="listarUsuarios">
      <soap:operation soapAction="listarUsuarios"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
    <operation name="listarMusicas">
      <soap:operation soapAction="listarMusicas"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
  </binding>

  <!-- Serviço -->
  <service name="MusicService">
    <port name="MusicServicePort" binding="tns:MusicServiceSoapBinding">
      <soap:address location="http://localhost:8000/musicService"/>
    </port>
  </service>
</definitions>
`;

// Servidor HTTP
const server = http.createServer((req, res) => {
  res.end('SOAP server running');
});

// Inicializar o servidor SOAP
soap.listen(server, '/musicService', musicService, wsdl);

server.listen(8000, () => {
  console.log('SOAP server listening on http://localhost:8000/musicService');
  console.log('WSDL available at http://localhost:8000/musicService?wsdl');
});

// Log de quando o servidor recebe requisições
server.on('request', (req) => {
  console.log('Recebendo uma requisição SOAP...');
});
