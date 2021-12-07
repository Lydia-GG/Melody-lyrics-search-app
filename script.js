// variables
const form = document.getElementById('search-section');
const search = document.getElementById('search');
const results = document.getElementById('results');
const lyricsDiv = document.getElementById('lyrics');
const baseUrl = 'https://api.lyrics.ovh';

// fetchData function 
function notFound(){
  results.textContent = 'No Results. Try again, please'
  results.classList.add('not-found')
}
function noLyrics(){
results.textContent = 'Sorry, No Lyrics found for this song';
results.classList.add('not-found')
}
async function fetchData(url) {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  throw new Error('something went wrong');
}

// addEventListeners
form.addEventListener('submit', (event) =>{
  event.preventDefault();
  let searchValue = search.value.trim();
  if(!searchValue){
    notFound();
  } else {
    startSearch(searchValue);
  }
});

// functions
async function startSearch(searchValue) {
  try{
        const data = await fetchData(`${baseUrl}/suggest/${searchValue}`);
      console.log(data)
      showData(data)

  } catch(error){
    console.log(error.message);
  }
}


function showData(data) {
  results.innerHTML = '';
  results.classList.remove('not-found')

  if (data.data.length !== 0) {

    data.data.forEach((song) => {
      const songCard = document.createElement('div');
      songCard.classList.add('song-card')
      results.appendChild(songCard);
      const albumCover = document.createElement('div');
      albumCover.classList.add('artist-img');
      songCard.appendChild(albumCover)

      const coverImage = document.createElement('img');
      coverImage.src =song.album.cover_medium ;
      coverImage.alt= `${song.title} + album cover`
      albumCover.appendChild(coverImage);

      const songDetails = document.createElement('div');
      songDetails.classList.add('song-details')
      songCard.appendChild(songDetails)

      const artistName = document.createElement('span');
      songDetails.appendChild(artistName);
      const getLinkBtn = document.createElement('div')
      getLinkBtn.classList.add('get-buttons')
      songDetails.appendChild(getLinkBtn);

      const songLyrics = document.createElement('span');
      songLyrics.setAttribute('id', 'get-btn');
      songLyrics.setAttribute('data-artist', `${song.artist.name}`);
      songLyrics.setAttribute('data-songtitle', `${song.title}`);
      getLinkBtn.appendChild(songLyrics);
      artistName.innerHTML = `<strong>${song.artist.name}</strong> - ${song.title}`;
      songLyrics.innerHTML = 'Get Lyrics';
      songLyrics.addEventListener('click', showLyrics);

      const songLink = document.createElement('span');
      songLink.setAttribute('id', 'link-btn');
      getLinkBtn.appendChild(songLink);

      const songAnchor = document.createElement('a')
      songLink.appendChild(songAnchor);
      songAnchor.setAttribute('href',song.link);
      songAnchor.setAttribute('target','_blank');
      songAnchor.textContent = 'Song Link'
      songAnchor.classList.add('link-style')
      
    });

  } else{
    notFound();
  }
}

function showLyrics(event) {
    const artist = event.target.getAttribute('data-artist');
    const songTitle = event.target.getAttribute('data-songtitle');
    console.log(artist, songTitle);
    getLyrics(artist, songTitle);
}


async function getLyrics(artist, songTitle) {
try{
  const data = await fetchData(`${baseUrl}/v1/${artist}/${songTitle}`);
  const lyricsText = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  console.log(data);
  console.log(lyricsText)
  lyricsDiv.innerHTML='';
  const closeBtn = document.createElement('button');
  lyricsDiv.appendChild(closeBtn);
  closeBtn.setAttribute('id', 'close-btn');
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';

  closeBtn.addEventListener('click',() => {
    closeBtn.parentElement.classList.remove('displayLyrics');
    });

    const songLyricsDiv = document.createElement('div');
    lyricsDiv.appendChild(songLyricsDiv);
    songLyricsDiv.setAttribute('class', 'song-lyrics');
    const lyricsTitle = document.createElement('h2');
    songLyricsDiv.appendChild(lyricsTitle);
    lyricsTitle.innerHTML = `${artist} - ${songTitle}`;
    const lyricsP = document.createElement('p');
    songLyricsDiv.appendChild(lyricsP);
    lyricsP.innerHTML = lyricsText;
    lyricsDiv.classList.add('displayLyrics');

} catch(error){
  console.log(error.message);
  noLyrics();
}
}