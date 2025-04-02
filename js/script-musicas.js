const CLIENT_ID = '17e3d3d855e34858a3c2fc50630f6ab3';  // Coloque seu Client ID
const CLIENT_SECRET = 'e365a28b00294e6d99ba1f112a706cac';  // Coloque seu Client Secret
const REDIRECT_URI = 'https://nicolas-malheiros.github.io/sistema-veri/telas/musicas.html';  // Seu Redirect URI
const mensagemInteracao = document.querySelector('.mensagemUsuario');



if (mensagemInteracao) {
    // Altera o conteúdo após 5 segundos
    setTimeout(() => {
        mensagemInteracao.textContent = 'Bom agora usufrua escolhendo músicas, vai lá veri, mostra sua cultura';
    }, 5000);
} else {
    console.error('Elemento .mensagem-usuario não encontrado!');
}



// Função para iniciar o processo de login
function startLogin() {
  const SCOPE = 'user-library-read playlist-read-private';  // Escopos necessários
  const STATE = 'random_state_string';  // Para proteger contra CSRF
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&state=${STATE}`;
  
  window.location.href = AUTH_URL;  // Redireciona para a página de login do Spotify
}

// Função para capturar o código de autorização da URL
function getAuthorizationCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

// Função para trocar o código de autorização por um token de acesso
function getAccessToken(authorizationCode) {
  const body = new URLSearchParams({
    code: authorizationCode,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
  };

  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: headers,
    body: body,
  })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('spotify_access_token', data.access_token);
        loadPlaylist();  // Carrega a playlist quando o token é obtido
      } else {
        console.error('Erro ao obter o token de acesso:', data);
      }
    })
    .catch(error => {
      console.error('Erro na requisição do token:', error);
    });
}

// Verifique se a página contém um código de autorização e, se sim, obtenha o token
const authorizationCode = getAuthorizationCode();
if (authorizationCode) {
  getAccessToken(authorizationCode);
} else {
  if (!localStorage.getItem('spotify_access_token')) {
    startLogin();  // Inicia o processo de login caso o usuário não tenha o token
  }
}

// Função para buscar músicas no Spotify
function searchMusic() {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) {
    alert('Você precisa estar logado para buscar músicas.');
    return;
  }

  const searchQuery = document.getElementById('search-bar').value;
  if (searchQuery.trim() === '') {
    alert('Por favor, insira o nome da música.');
    return;
  }

  const url = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=10`;

  fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(response => response.json())
  .then(data => {
    displaySearchResults(data.tracks.items);
  })
  .catch(error => {
    console.error('Erro ao buscar músicas:', error);
  });
}

// Função para exibir os resultados da pesquisa
function displaySearchResults(tracks) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';  // Limpa resultados anteriores

  tracks.forEach(track => {
    const songElement = document.createElement('div');
    songElement.classList.add('search-result');
    
    const songImg = document.createElement('img');
    songImg.src = track.album.images[0].url;
    
    const songName = document.createElement('p');
    songName.textContent = track.name;
    
    const songButton = document.createElement('button');
    songButton.textContent = 'Adicionar';
    songButton.onclick = () => addSongToPlaylist(track);
    
    songElement.appendChild(songImg);
    songElement.appendChild(songName);
    songElement.appendChild(songButton);

    resultsContainer.appendChild(songElement);
  });
}

// Função para adicionar a música ao localStorage
function addSongToPlaylist(track) {
  const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  
  // Verifica se a música já foi adicionada
  const songExists = playlist.some(song => song.name === track.name && song.artist === track.artists[0].name);

  if (songExists) {
    alert(`${track.name} já está na sua playlist!`);
    return;
  }

  playlist.push({
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    imageUrl: track.album.images[0].url,
  });

  localStorage.setItem('playlist', JSON.stringify(playlist));
  //alert(`${track.name} foi adicionada à sua playlist!`);

  loadPlaylist();  // Recarrega a playlist para exibir a nova música
}

// Função para remover uma música da playlist
function removeSongFromPlaylist(songName) {
  const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  const updatedPlaylist = playlist.filter(song => song.name !== songName);
  localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
  loadPlaylist();  // Recarrega a playlist após remoção
}

// Carregar músicas do localStorage ao carregar a página
window.onload = () => {
  loadPlaylist();
};

// Função para carregar a playlist do localStorage e exibir as músicas
function loadPlaylist() {
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  
    // Limpa as músicas exibidas
    const selectedSongsContainer = document.querySelector('.selected-songs');
    selectedSongsContainer.innerHTML = '<h2>Músicas Selecionadas:</h2>';  // Reaparece a legenda
  
    // Exibe todas as músicas da playlist
    playlist.forEach((song) => {
      const songElement = document.createElement('div');
      songElement.classList.add('song');
      songElement.innerHTML = `
        <img src="${song.imageUrl}" alt="${song.name}">
        <p>${song.name} - ${song.artist}</p>
        <button onclick="removeSongFromPlaylist('${song.name}')">Remover</button>
      `;
      selectedSongsContainer.appendChild(songElement);
    });
  }