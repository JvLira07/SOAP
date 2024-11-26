const soap = require('soap');
const http = require('http');

// Dados em memória
const data = {
  usuarios: [],
  musicas: [],
  playlists: [],
};

// Funções do Serviço
const musicService = {
  MusicService: {
    MusicServiceSoap: {
      // Listar usuários
      listarUsuarios: function (_, callback) {
        callback(null, { usuarios: data.usuarios });
      },

      // Listar músicas
      listarMusicas: function (_, callback) {
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
  targetNamespace="http://www.example.org/MusicService/"
  xmlns:tns="http://www.example.org/MusicService/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
  xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <!-- Esquema XML -->
  <types>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.example.org/MusicService/">
      <xs:element name="listarUsuariosRequest"/>
      <xs:element name="listarUsuariosResponse">
        <xs:complexType>
          <xs:sequence>
            <xs:element name="usuarios" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>

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

// Porta de escuta
server.listen(8000, () => {
    console.log('SOAP server listening on http://localhost:8000/musicService');
    console.log('WSDL available at http://localhost:8000/musicService?wsdl');
  });
  
