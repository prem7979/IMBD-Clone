const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const myFavorites = document.getElementById('my-favorites');

// Load movies from the API
async function loadMovies(searchTerm) {
  const apiKey = 'bfd6b563';
  const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response == 'True') {
    displayMovieList(data.Search);
  }
}

// Find movies based on search term
function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

// Display movie list
function displayMovieList(movies) {
  searchList.innerHTML = '';
  for (let i = 0; i < movies.length; i++) {
    let movieItem = document.createElement('div');
    movieItem.dataset.id = movies[i].imdbID;
    movieItem.classList.add('search-list-item');

    let moviePoster =
      movies[i].Poster !== 'N/A' ? movies[i].Poster : 'imagenotfound.jpg';

    movieItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[i].Title}</h3>
                <p>${movies[i].Year}</p>
            </div>
        `;

    searchList.appendChild(movieItem);
  }
  loadMovieDetails();
}

// Load movie details
function loadMovieDetails() {
  const searchListItems = searchList.querySelectorAll('.search-list-item');
  searchListItems.forEach((item) => {
    item.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = '';
      const response = await fetch(
        `https://www.omdbapi.com/?i=${item.dataset.id}&apikey=bfd6b563`
      );
      const movieDetails = await response.json();
      displayMovieDetails(movieDetails);
    });
  });
}

// Display movie details
function displayMovieDetails(details) {
  myFavorites.style.display = 'none';
  resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${
              details.Poster !== 'N/A' ? details.Poster : 'medium-cover.jpg'
            }" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="director"><b>Director:</b> ${details.Director}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <div class="favorite-button" onclick="handleFavoriteButtonClick('${
              details.imdbID
            }')">
                <i class="fas fa-star"></i> Add to Favorites
            </div>
        </div>
    `;
}

// Function to handle favorite button click
function handleFavoriteButtonClick(movieId) {
  const favoriteMovies = getFavoriteMovies();
  console.log('Favorite movies1:', favoriteMovies);
  if (favoriteMovies) {
    const movieIndex = favoriteMovies.find((movie) => movie === movieId);
    if (movieIndex) {
      // Movie already in favorites, remove it
      favoriteMovies.splice(movieIndex, 1);
      alert('Removed Successfully');
    } else {
      // Movie not in favorites, add it
      favoriteMovies.push(movieId);
      alert('Added Successfully');
    }
  } else {
    favoriteMovies.push(movieId);
    alert('Added Successfully');
  }

  saveFavoriteMovies(favoriteMovies);
  location.reload();
}

// Get favorite movies from local storage
function getFavoriteMovies() {
  const favoriteMovies = localStorage.getItem('favoriteMovies');
  if (favoriteMovies) {
    return JSON.parse(favoriteMovies);
  }
  return [];
}

// Save favorite movies to local storage
function saveFavoriteMovies(favoriteMovies) {
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

// Function to display favorite movies
function displayFavoriteMovies() {
  console.log('Hello');
  const favoriteMovies = getFavoriteMovies();

  const resultGrid = document.getElementById('result-grid');
  resultGrid.innerHTML = '';

  favoriteMovies.forEach((movieId) => {
    fetchMovieDetails(movieId)
      .then((details) => {
        const movieElement = createMovieElement(details);
        resultGrid.appendChild(movieElement);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  });
}

// Function to create movie element
function createMovieElement(details) {
  console.log({ details });
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie');
  movieElement.innerHTML = `
        <div class="movie-poster">
            <img src="${details.Poster}" alt="${details.Title} Poster">
        </div>
        <div class="movie-details">
            <h2 class="title">${details.Title}</h2>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="director"><b>Director:</b> ${details.Director}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <div class="favorite-button" onclick="handleFavoriteButtonClick('${details.imdbID}')">
                <i class="fas fa-star"></i> Remove from Favorites
            </div>
        </div>
    `;

  return movieElement;
}

async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=bfd6b563&i=${movieId}`
  );
  const data = await response.json();
  return data;
}

// Call this function to display favorite movies on page load
displayFavoriteMovies();
