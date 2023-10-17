const getAverageRating = ratings => {
  return ratings[0].Value.split('/').shift();
};
let storageCount = 0;
const buildCard = movie => {
  if (storageCount == 2) return;
  storageCount++;
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
       <i class="bi bi-patch-minus-fill" alt></i>
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

document.addEventListener('DOMContentLoaded', () => {
  let moviesToWatch = localStorage.getItem('movies');
  const {toWatch} = JSON.parse(moviesToWatch);
  resultCount = 0;
  toWatch.map(movieToWatch => buildCard(JSON.parse(movieToWatch)));
});
