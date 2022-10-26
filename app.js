const API_URL =
  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=d65479d0ffac11766164f75e03a6e533&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_URL =
  'https://api.themoviedb.org/3/search/movie?api_key=d65479d0ffac11766164f75e03a6e533&query="';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');
const tagsEl = document.getElementById('tags');

const genres = [
  {
    id: 28,
    name: 'Action',
  },
  {
    id: 12,
    name: 'Adventure',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Comedy',
  },
  {
    id: 80,
    name: 'Crime',
  },
  {
    id: 99,
    name: 'Documentary',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Family',
  },
  {
    id: 14,
    name: 'Fantasy',
  },
  {
    id: 36,
    name: 'History',
  },
  {
    id: 27,
    name: 'Horror',
  },
  {
    id: 10402,
    name: 'Music',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10749,
    name: 'Romance',
  },
  {
    id: 878,
    name: 'Science Fiction',
  },
  {
    id: 10770,
    name: 'TV Movie',
  },
  {
    id: 53,
    name: 'Thriller',
  },
  {
    id: 10752,
    name: 'War',
  },
  {
    id: 37,
    name: 'Western',
  },
];

let selectedGenre = [];

const setGenre = function () {
  tagsEl.innerHTML = ``;
  genres.forEach((genre) => {
    const genreEl = document.createElement('div');
    genreEl.classList.add('tag');
    genreEl.id = genre.id;
    genreEl.innerText = genre.name;

    genreEl.addEventListener('click', () => {
      if (selectedGenre.length === 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, i) => {
            if (id === genre.id) {
              selectedGenre.splice(i, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }

      getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
      highlightSelection();
    });
    tagsEl.append(genreEl);
  });
};
setGenre();

const highlightSelection = function () {
  const tags = document.querySelectorAll('.tag');
  tags.forEach((tag) => {
    tag.classList.remove('highlight');
  });
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const highlightedTag = document.getElementById(id);
      highlightedTag.classList.add('highlight');
    });
  }
};

getMovies(API_URL);
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();

  if (data.results.length !== 0) {
    showMovies(data.results);
  } else {
    main.innerHTML = ` <h1 class='no-results'> Something went wrong. Try again later! 😕</h1>`;
  }
}

function showMovies(movies) {
  main.innerHTML = '';

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview } = movie;

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <img src="${
        IMG_PATH + poster_path
          ? IMG_PATH + poster_path
          : 'https://via.placeholder.com/1080x1580'
      }"
          alt="${title}">
      <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
    <div class="overview">
          <h3>Overview</h3>
        ${overview}
      `;
    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== '') {
    getMovies(SEARCH_URL + searchTerm);
    search.value = '';
  } else {
    window.location.reload();
  }
});
