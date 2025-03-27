const mensagemUsuario = document.querySelector('.mensagem-usuario');


setTimeout(() => {
    mensagemUsuario.classList.add('hidden');
}, 8000);




// Função para buscar filmes na API OMDb
function searchMovies() {
    const searchQuery = document.getElementById('search-bar').value; // Captura o texto da busca
    if (searchQuery.trim() === '') {
      alert('Por favor, insira o nome do filme.');
      return;
    }
  
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=236ea914`;
  
    // Faz a requisição à API OMDb
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifique a resposta da API no console
        if (data.Response === 'True') {
          displaySearchResults(data.Search); // Exibe os filmes encontrados
        } else {
          alert('Filmes não encontrados!');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar filmes:', error);
      });
  }
  
  // Função para exibir os resultados da pesquisa de filmes
  function displaySearchResults(movies) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Limpa os resultados anteriores

    const title = document.createElement('h2');
    title.textContent = 'Escolha o filme desejado';
    resultsContainer.appendChild(title);  // Adiciona o título ao contêiner
  
    movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('search-result');
      
      const movieImg = document.createElement('img');
      movieImg.src = movie.Poster !== 'N/A' ? movie.Poster : 'default-poster.jpg'; // Caso não tenha poster, exibe uma imagem padrão
      
      const movieName = document.createElement('p');
      movieName.textContent = movie.Title;
      
      const movieYear = document.createElement('p');
      movieYear.textContent = `Ano: ${movie.Year}`;
      
      const movieButton = document.createElement('button');
      movieButton.textContent = 'Adicionar';
      movieButton.onclick = () => addMovieToFavorites(movie);  // Função para adicionar o filme aos favoritos
      
      movieElement.appendChild(movieImg);
      movieElement.appendChild(movieName);
      movieElement.appendChild(movieYear);
      movieElement.appendChild(movieButton);
      
      resultsContainer.appendChild(movieElement);
    });
  }
  
  // Função para adicionar um filme aos favoritos (armazenando no localStorage)
  function addMovieToFavorites(movie) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    
    // Verifica se o filme já foi adicionado aos favoritos
    const movieExists = favoriteMovies.some(favMovie => favMovie.imdbID === movie.imdbID);
    
    if (movieExists) {
      alert(`${movie.Title} já está nos seus favoritos!`);
      return;
    }
  
    favoriteMovies.push({
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbID: movie.imdbID,
    });
  
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    //alert(`${movie.Title} foi adicionado aos seus favoritos!`);
    setTimeout(() => {
        location.reload();
    }, 300);
    console.log(favoriteMovies);  // Verifica no console os filmes favoritos
  }
  
  // Função para carregar os filmes favoritos do localStorage
  function loadFavoriteMovies() {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const favoriteMoviesContainer = document.getElementById('favorite-movies');
    
    favoriteMoviesContainer.innerHTML = '<h2>Filmes Favoritos:</h2>';  // Reaparece a legenda
  
    favoriteMovies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('favorite-movie');
      
      const movieImg = document.createElement('img');
      movieImg.src = movie.Poster;
      
      const movieName = document.createElement('p');
      movieName.textContent = movie.Title;
      
      const movieYear = document.createElement('p');
      movieYear.textContent = `Ano: ${movie.Year}`;
      
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remover';
      removeButton.onclick = () => removeMovieFromFavorites(movie.imdbID);  // Função para remover o filme dos favoritos
      
      movieElement.appendChild(movieImg);
      movieElement.appendChild(movieName);
      movieElement.appendChild(movieYear);
      movieElement.appendChild(removeButton);
      
      favoriteMoviesContainer.appendChild(movieElement);
    });
  }
  
  // Função para remover um filme dos favoritos
  function removeMovieFromFavorites(imdbID) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== imdbID);
    
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    loadFavoriteMovies();  // Recarrega os filmes favoritos após remoção
  }
  
  // Carregar os filmes favoritos quando a página for carregada
  window.onload = () => {
    loadFavoriteMovies();
  };
  