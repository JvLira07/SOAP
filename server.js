const soap = require('soap');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.raw({ type: () => true, limit: '5mb' }));


const database = {
  usuarios: [
    { id: 1, nome: 'Alice', idade: 25 },
    { id: 2, nome: 'Bob', idade: 30 },
  ],
  musicas: [
    { id: 1, nome: 'Song 1', artista: 'Artist 1' },
    { id: 2, nome: 'Song 2', artista: 'Artist 2' },
  ],
  playlists: [
    {
      id: 1,
      nome: 'Playlist 1',
      usuarioId: 1,
      musicas: [1, 2], 
    },
    {
      id: 2,
      nome: 'Playlist 2',
      usuarioId: 2,
      musicas: [1], 
    },
  ],
};


// Funções do serviço
const service = {
  MusicStreamingService: {
    MusicStreamingPort: {
      listarUsuarios: (_, callback) => {
        callback(null, { usuarios: database.usuarios });
      },
      listarMusicas: (_, callback) => {
        callback(null, { musicas: database.musicas });
      },
      listarPlaylistsUsuario: ({ usuarioId }, callback) => {
        const playlists = database.playlists.filter(
          (playlist) => playlist.usuarioId === usuarioId
        );
        callback(null, { playlists });
      },
      listarMusicasPlaylist: ({ playlistId }, callback) => {
        const playlist = database.playlists.find(
          (playlist) => playlist.id === playlistId
        );
        if (playlist) {
          const musicas = playlist.musicas.map((id) =>
            database.musicas.find((musica) => musica.id === id)
          );
          callback(null, { musicas });
        } else {
          callback({ message: 'Playlist não encontrada' });
        }
      },
      listarPlaylistsPorMusica: ({ musicaId }, callback) => {
        const playlists = database.playlists.filter((playlist) =>
          playlist.musicas.includes(musicaId)
        );
        callback(null, { playlists });
      },
    },
  },
};

// Definição do WSDL
const wsdl = `
<definitions name="MusicStreamingService"
  targetNamespace="http://www.example.org/MusicStreamingService/"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://www.example.org/MusicStreamingService/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <types>
    <xsd:schema targetNamespace="http://www.example.org/MusicStreamingService/">
      <!-- Definições existentes -->
      <xsd:element name="listarUsuariosRequest" type="xsd:anyType"/>
      <xsd:element name="listarUsuariosResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="usuarios" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Nova definição para listar músicas -->
      <xsd:element name="listarMusicasRequest" type="xsd:anyType"/>
      <xsd:element name="listarMusicasResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="musicas" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Nova definição para listar playlists de um usuário -->
      <xsd:element name="listarPlaylistsPorUsuarioRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="usuarioId" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="listarPlaylistsPorUsuarioResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="playlists" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Nova definição para listar músicas de uma playlist -->
      <xsd:element name="listarMusicasPorPlaylistRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="playlistId" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="listarMusicasPorPlaylistResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="musicas" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <!-- Nova definição para listar playlists que contêm uma música -->
      <xsd:element name="listarPlaylistsPorMusicaRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="musicaId" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="listarPlaylistsPorMusicaResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="playlists" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

    </xsd:schema>
  </types>

  <message name="listarUsuariosRequest"/>
  <message name="listarUsuariosResponse">
    <part name="usuarios" element="tns:usuarios"/>
  </message>

  <!-- Mensagens para listar músicas -->
  <message name="listarMusicasRequest"/>
  <message name="listarMusicasResponse">
    <part name="musicas" element="tns:musicas"/>
  </message>

  <!-- Mensagens para listar playlists por usuário -->
  <message name="listarPlaylistsPorUsuarioRequest">
    <part name="usuarioId" element="tns:usuarioId"/>
  </message>
  <message name="listarPlaylistsPorUsuarioResponse">
    <part name="playlists" element="tns:playlists"/>
  </message>

  <!-- Mensagens para listar músicas por playlist -->
  <message name="listarMusicasPorPlaylistRequest">
    <part name="playlistId" element="tns:playlistId"/>
  </message>
  <message name="listarMusicasPorPlaylistResponse">
    <part name="musicas" element="tns:musicas"/>
  </message>

  <!-- Mensagens para listar playlists por música -->
  <message name="listarPlaylistsPorMusicaRequest">
    <part name="musicaId" element="tns:musicaId"/>
  </message>
  <message name="listarPlaylistsPorMusicaResponse">
    <part name="playlists" element="tns:playlists"/>
  </message>

  <portType name="MusicStreamingPortType">
    <operation name="listarUsuarios">
      <input message="tns:listarUsuariosRequest"/>
      <output message="tns:listarUsuariosResponse"/>
    </operation>

    <!-- Operações para listar músicas, playlists e músicas de playlists -->
    <operation name="listarMusicas">
      <input message="tns:listarMusicasRequest"/>
      <output message="tns:listarMusicasResponse"/>
    </operation>

    <operation name="listarPlaylistsPorUsuario">
      <input message="tns:listarPlaylistsPorUsuarioRequest"/>
      <output message="tns:listarPlaylistsPorUsuarioResponse"/>
    </operation>

    <operation name="listarMusicasPorPlaylist">
      <input message="tns:listarMusicasPorPlaylistRequest"/>
      <output message="tns:listarMusicasPorPlaylistResponse"/>
    </operation>

    <operation name="listarPlaylistsPorMusica">
      <input message="tns:listarPlaylistsPorMusicaRequest"/>
      <output message="tns:listarPlaylistsPorMusicaResponse"/>
    </operation>

  </portType>

  <binding name="MusicStreamingBinding" type="tns:MusicStreamingPortType">
    <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>

    <!-- Operações de SOAP para listar músicas, playlists, etc. -->
    <operation name="listarUsuarios">
      <soap:operation soapAction="listarUsuarios"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>

    <operation name="listarMusicas">
      <soap:operation soapAction="listarMusicas"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>

    <operation name="listarPlaylistsPorUsuario">
      <soap:operation soapAction="listarPlaylistsPorUsuario"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>

    <operation name="listarMusicasPorPlaylist">
      <soap:operation soapAction="listarMusicasPorPlaylist"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>

    <operation name="listarPlaylistsPorMusica">
      <soap:operation soapAction="listarPlaylistsPorMusica"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>

  <service name="MusicStreamingService">
    <port name="MusicStreamingPort" binding="tns:MusicStreamingBinding">
      <soap:address location="http://localhost:8000/soap"/>
    </port>
  </service>
</definitions>
`;

// Inicializa o servidor SOAP
const server = app.listen(8000, () => {
  console.log('SOAP server listening on port 8000');
});

soap.listen(server, '/soap', service, wsdl);




/* <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:web="http://www.example.org/MusicStreamingService/">
<soapenv:Header/>
<soapenv:Body>
   <web:listarUsuarios/>
</soapenv:Body>
</soapenv:Envelope> */  //envelope para testar no POSTMAN

//http://localhost:8000/soap
