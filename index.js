import {APIKEY} from './config.js';

const searchEl = document.getElementById('search-movie');

let resultsEl = document.getElementById('results');

let resultCount = 0;
const getAverageRating = ratings => {
  return ratings[0].Value.split('/').shift();
};

let moviesArray = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('movies')) {
    console.log('');
  } else {
    let t = JSON.parse(localStorage.getItem('movies'));
    moviesArray = t.toWatch;
  }
});

document.getElementById('results').addEventListener('click', function(e) {
  let movieId =
    e.target.parentElement.parentElement.parentElement.parentElement.id;
  fetchMovieById(movieId).then(data => {
    moviesArray.push(JSON.stringify(data));
    localStorage.setItem(`movies`, JSON.stringify({toWatch: moviesArray}));
  });
});

const buildCard = movie => {
  if (resultCount == 2) return;
  resultCount++;
  const {Poster, Title, Plot, Runtime, Genre, Ratings, imdbID} = movie;
  let resultsEl = document.getElementById('results');

  Plot.split('').splice(0, 100).join('', ',') + '...';
  let cardContainer = document.createElement('div');
  cardContainer.classList.add('container-row');
  cardContainer.id = imdbID;
  let cardDetailsContainer = document.createElement('div');

  let movieHeader = document.createElement('div');
  movieHeader.innerHTML = `<div class="card-header"><strong>${Title}</strong><strong>${getAverageRating(
    Ratings
  )}</strong></div>`;

  let movieInfo = document.createElement('div');
  movieInfo.innerHTML = `
    <div>
      <span>${Runtime}</span>
      <span>${Genre}</span>
      <i class="bi bi-patch-plus-fill"></i>
    </div>
    `;
  let movieDetails = document.createElement('p');
  movieDetails.innerText = Plot.split('').splice(0, 100).join('', ',') + '...';

  let imageContainerEl = document.createElement('div');
  let moviePoster = document.createElement('img');
  moviePoster.src = Poster;
  moviePoster.classList.add('poster');

  imageContainerEl.append(moviePoster);
  cardDetailsContainer.append(movieHeader);
  cardDetailsContainer.append(movieInfo);

  cardDetailsContainer.append(movieDetails);
  cardContainer.append(cardDetailsContainer);
  cardContainer.append(imageContainerEl);
  resultsEl.appendChild(cardContainer);
};

const fetchMovieById = async id => {
  console.log(id);
  const results = await fetch(
    `http://www.omdbapi.com/?apikey=${APIKEY}&i=${id}`
  );
  const movieInfo = await results.json();
  return movieInfo;
};

const fetchMovieByQuery = async query => {
  const {title} = query;
  const searchResults = await fetch(
    `http://www.omdbapi.com/?apikey=${APIKEY}&s=${title}&plot=full&page=1`
  );

  const movies = await searchResults.json();
  const {Search} = movies;

  Search.map((element, idx) => {
    fetch(
      `http://www.omdbapi.com/?apikey=${APIKEY}&t=${element.Title}&plot=full`
    )
      .then(result => result.json())
      .then(data => buildCard(data));
  });
};

searchEl.addEventListener('submit', e => {
  e.preventDefault();
  resultsEl.innerHTML = null;
  resultCount = 0;
  const searchData = {title: e.target[0].value};
  fetchMovieByQuery(searchData);
});
