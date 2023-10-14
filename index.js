const searchEl = document.getElementById('search-movie');
const searchResults = [];
let resultsEl = document.getElementById('results');

let watchListResultsEl = document.getElementById('watchlist');
const watchListArray = [];

const watchListToggleEL = document.getElementById('watchlist-toggle');
const searchPageToggleEl = document.getElementById('search-toggle');

const getAverageRating = ratings => {
  return ratings[0].Value.split('/').shift();
};

document.getElementById('results').addEventListener('click', function(e) {
  let movieId =
    e.target.parentElement.parentElement.parentElement.parentElement.id;
  let movieDetails = document.getElementById(movieId);
  watchListArray.push({id: movieId, html: movieDetails});
});

///// This is where stopped - need to figure out how to control the 
//// search/watch toggle functionality - maybe revist with another page with link
watchListToggleEL.addEventListener('click', function(e) {
  console.log(watchListArray);

  // Attempting to just change the inner text
    /// basically if the button is watchlist - then render the watchilst page and hide the
    // the results - usings the watchlistarray
    // if this the the search then just empty rerender the page. with results
  watchListToggleEL.innerText === 'search'
    ? watchListToggleEL.innerText === 'Watch list'
    : (watchListToggleEL.innerText = 'Search');

  resultsEl.innerHTML = null;
  watchListArray.forEach(element => {
    watchListResultsEl.append(element.html);
  });
});

const buildCard = movie => {
  console.log('inbuild card', movie);

  const {
    Poster,
    Title,
    Type,
    Plot,
    Runtime,
    Genre,
    Year,
    Ratings,
    imdbID
  } = movie;
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
      <button>Add to watchlist</button>
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

const fetchMovieByQuery = async query => {
  const {title} = query;
  const searchResults = await fetch(
    `http://www.omdbapi.com/?apikey=a2e1d496&s=${title}&plot=full`
  );

  const movies = await searchResults.json();
  const {Search} = movies;

  searchResult = Search.map(element => {
    fetch(
      `http://www.omdbapi.com/?apikey=a2e1d496&t=${element.Title}&plot=full`
    )
      .then(result => result.json())
      .then(data => buildCard(data));
  });
};

searchEl.addEventListener('submit', e => {
  e.preventDefault();
  resultsEl.innerHTML = null;

  const searchData = {title: e.target[0].value};
  fetchMovieByQuery(searchData);
});
