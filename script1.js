document.addEventListener("DOMContentLoaded", function () {
    // Elements from the DOM
    const playPauseButton = document.getElementById('play-pause');
    const nextButton = document.getElementById('next');
    const previousButton = document.getElementById('previous');
    const playlist = document.getElementById('playlist');
    const songTitleElement = document.getElementById('song-title');
    const currentTimeElement = document.getElementById('current-time');
    const seekBar = document.getElementById('seek-bar');
    const volumeBar = document.getElementById('volume-bar');
    const volumeButton = document.getElementById('volume-button');
    const albumList = document.getElementById('album-list');
    const allSongsList = document.getElementById('all-songs-list');
    const showAllSongsButton = document.getElementById('show-all-songs');
    const playAllButton = document.getElementById('play-all');
    const albumTitle = document.getElementById('album-title');
    const albumImage = document.getElementById('album-image');
    const artistName = document.getElementById('artist-name');
    const songImage = document.getElementById('song-image');
    const allSongsSection = document.querySelector('.all-songs');
    const backward10Button = document.getElementById('backward-10');
    const forward10Button = document.getElementById('forward-10');
    const shuffleButton = document.getElementById('shuffle');

    // Sample album data
    const albums = [
        {
            title: 'Album 1',
            artist: 'Artist 1',
            image: 'images/image.png',
            songs: [
                { title: 'Ave Tu', src: 'songs/Ave Tu.mp3', image: 'images/song1.png' },
                { title: 'Halaji', src: 'songs/Halaji.mp3', image: 'images/song1.png' }
            ]
        },
        {
            title: 'Album 2',
            artist: 'Artist 2',
            image: 'images/image.png',
            songs: [
                { title: 'Har Har Gange', src: 'songs/Har Har Ganga.mp3', image: 'images/song1.png' },
                { title: 'Bandaya', src: 'songs/Krishna Flute.mp3', image: 'images/song1.png' }
            ]
        },
        {
            title: 'Album 3',
            artist: 'Artist 3',
            image: 'images/image.png',
            songs: [
                { title: 'Ochi Ochi diwaro sa', src: 'songs/Humdard.mp3', image: 'images/song1.png' },
                { title: 'Shape Of You', src: 'songs/Shapeofyou.mp3', image: 'images/song1.png' }
            ]
        }
    ];

    let audioElement = new Audio(); // Audio element for playing songs
    let currentSongIndex = 0; // Index of the currently playing song
    let currentAlbumIndex = 0; // Index of the currently selected album
    let timeUpdateInterval = null; // Interval ID for updating the time display
    let playAllSongs = false; // Flag to track if playing all songs
    let allSongs = []; // Array to store all songs for the "Play All" feature
    let isMuted = false; // Flag to track if the audio is muted
    let isShuffling = false; // Flag to track if shuffle mode is active

    // Function to load and display albums
    function loadAlbums() {
        albumList.innerHTML = ''; // Clear existing album list
        albums.forEach((album, index) => {
            const listItem = document.createElement('li');
            listItem.className = "album-list-card";
            listItem.dataset.index = index;

            // Create album details container
            const albumDetails = document.createElement('div');
            albumDetails.className = "album-details";

            // Create album image element
            const albumImage = document.createElement('img');
            albumImage.src = album.image;
            albumImage.alt = album.title;
            albumImage.className = "album-image";

            // Create album title element
            const albumTitle = document.createElement('p');
            albumTitle.textContent = album.title;
            albumTitle.className = "album-title";

            // Create artist name element
            const artistName = document.createElement('p');
            artistName.textContent = album.artist;
            artistName.className = "artist-name";

            // Append elements to the album details container
            albumDetails.appendChild(albumImage);
            albumDetails.appendChild(albumTitle);
            albumDetails.appendChild(artistName);

            // Append album details to the list item
            listItem.appendChild(albumDetails);

            // Add click event to load the album
            listItem.addEventListener('click', () => {
                loadAlbum(index); // Load the selected album
            });

            // Append the list item to the album list
            albumList.appendChild(listItem);
        });
    }


    // Function to load and display all songs
    function loadAllSongs() {
        allSongsList.innerHTML = ''; // Clear existing list
        allSongs = []; // Reset allSongs array
        albums.forEach((album) => {
            album.songs.forEach((song, songIndex) => {
                const listItem = document.createElement('li');
                listItem.textContent = song.title;
                listItem.dataset.songIndex = allSongs.length;
                listItem.addEventListener('click', () => {
                    loadSong(listItem.dataset.songIndex); // Load the selected song
                    playSong();
                });
                allSongsList.appendChild(listItem);
                allSongs.push(song); // Add song to allSongs array
            });
        });
    }

    // Function to display the "All Songs" section
    function showAllSongs() {
        allSongsSection.style.display = 'block'; // Show the section
        loadAllSongs(); // Load all songs into the section
    }

    // Function to play all songs in sequence
    function playAll() {
        playAllSongs = true; // Set flag to true
        currentSongIndex = 0; // Start with the first song
        loadSong(currentSongIndex);
        playSong();
    }

    // Function to load and display a specific album
    // Function to load a specific album
    function loadAlbum(index) {
        const album = albums[index];
        albumTitle.textContent = album.title; // Set album title
        albumImage.src = album.image; // Set album image
        artistName.textContent = album.artist; // Set artist name
        playlist.innerHTML = ''; // Clear existing playlist
        album.songs.forEach((song, songIndex) => {
            const listItem = document.createElement('li');
            listItem.className = 'playlist-item';
            listItem.dataset.index = songIndex;

            // Song image
            const songImage = document.createElement('img');
            songImage.src = song.image; // Assuming song.image exists
            songImage.alt = song.title;
            songImage.className = 'song-image';

            // Song title
            const songTitle = document.createElement('span');
            songTitle.textContent = song.title;
            songTitle.className = 'song-title';

            // Play/Pause button
            const playPauseButton = document.createElement('button');
            playPauseButton.className = 'play-pause';
            playPauseButton.textContent = 'Play';
           // playPauseButton.className='playpausebtn'
            playPauseButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent triggering the listItem click event
                if (audioElement.paused || currentSongIndex !== songIndex) {
                    loadSong(songIndex); // Load the selected song
                    playSong();
                    playPauseButton.textContent = 'Pause';
                    //playPauseButton.innerHTML='<img src="Assets/play_circle.svg" alt="">'
                } else {
                    pauseSong();
                    playPauseButton.textContent = 'Play';
                   // playPauseButton.innerHTML='<img src="Assets/pause.svg" alt="">'
                }
            });

            listItem.addEventListener('click', () => {
                loadSong(songIndex); // Load the selected song
                playSong();
            });

            // Append elements to the list item
            listItem.appendChild(songImage);
            listItem.appendChild(songTitle);
            listItem.appendChild(playPauseButton);
            playlist.appendChild(listItem);
        });
        currentAlbumIndex = index; // Set current album index
        allSongsSection.style.display = 'none'; // Hide the "All Songs" section
        playAllSongs = false; // Reset flag
        highlightCurrentAlbum(index); // Highlight the current album
    }


    // Function to load a specific song
    function loadSong(index) {
        const song = playAllSongs ? allSongs[index] : albums[currentAlbumIndex].songs[index];
        audioElement.src = song.src; // Set audio source
        songTitleElement.textContent = song.title; // Set song title
        //songImage.src = song.image; // Set song image
    
        //highlightCurrentSong(index);  // Highlight current song
        //highlightCurrentAlbum(currentAlbumIndex); // Highlight current album
    
        updateNowPlaying(index); // Update now playing section
        currentSongIndex = index; // Set current song index
    }
    
    function highlightCurrentSong(index) {
        const listItems = playlist.querySelectorAll('.playlist-item');
        listItems.forEach((item, i) => {
            const songTitleElement = item.querySelector('.song-title');
            if (i === index) {
                item.classList.add('current-song'); // Add the class to the current song
                songTitle.classList.add('current-song-title'); // Add the class to the current song title
            } else {
                item.classList.remove('current-song'); // Remove the class from other songs
                songTitle.classList.remove('current-song-title'); // Remove the class from other song titles
            }
        });
    }
    
    function highlightCurrentAlbum(index) {
        const albumItems = albumList.querySelectorAll('.album-list-card');
        albumItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('current-album'); // Add class to current album
            } else {
                item.classList.remove('current-album'); // Remove class from other albums
            }
        });
    }
    

    // Function to play the current song
    function playSong() {
        audioElement.play(); // Play the audio
        startUpdatingTime(); // Start updating the time display
    }

    // Function to pause the current song
    function pauseSong() {
        audioElement.pause(); // Pause the audio
        stopUpdatingTime(); // Stop updating the time display
    }

    function updatePlayPauseButton() {
        if (audioElement.paused) {
            playPauseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e8eaed"><path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';
        } else {
            playPauseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e8eaed"><path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';
        }
    }

    function togglePlayPause() {
        if (audioElement.paused) {
            playSong();
        } else {
            pauseSong();
        }
        updatePlayPauseButton(); // Update play/pause button icon
    }


    // Function to load and play the next song
    function loadNextSong() {
        if (playAllSongs) {
            currentSongIndex = (currentSongIndex + 1) % allSongs.length;
        } else {
            currentSongIndex = (currentSongIndex + 1) % albums[currentAlbumIndex].songs.length;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    // Function to load and play the previous song
    function loadPreviousSong() {
        if (playAllSongs) {
            currentSongIndex = (currentSongIndex - 1 + allSongs.length) % allSongs.length;
        } else {
            currentSongIndex = (currentSongIndex - 1 + albums[currentAlbumIndex].songs.length) % albums[currentAlbumIndex].songs.length;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    // Function to go back 10 seconds
    function backward10() {
        audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0);
    }

    // Function to go forward 10 seconds
    function forward10() {
        audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration);
    }

    // Function to shuffle songs
    function shuffleSongs() {
        isShuffling = !isShuffling; // Toggle shuffle state
        if (isShuffling) {
            allSongs = [...albums[currentAlbumIndex].songs].sort(() => Math.random() - 0.5);
            currentSongIndex = 0;
            loadSong(currentSongIndex);
            playSong();
        }
    }
    function updateVolumeButton() {
        if (audioElement.muted || audioElement.volume === 0) {
            volumeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/></svg>';
            // Path to your mute image
        } else {
            volumeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>'; // Path to your volume image
        }
    }

    // Function to handle volume change
    function handleVolumeChange() {
        if (!isMuted) {
            audioElement.volume = volumeBar.value / 100; // Update audio volume based on slider
        }
        updateVolumeButton(); // Update button image
    }

    // Function to toggle mute state
    function toggleMute() {
        isMuted = !isMuted; // Toggle mute state
        audioElement.muted = isMuted; // Set muted property
        updateVolumeButton(); // Update button image
        if (!isMuted) {
            volumeBar.value = audioElement.volume * 100; // Update volume slider
        } else {
            volumeBar.value = 0; // Set volume slider to 0 when muted
        }
    }

    // Event listener for volume slider change
    volumeBar.addEventListener('input', handleVolumeChange);

    // Event listener for volume button click
    volumeButton.addEventListener('click', toggleMute);

    // Initialize the volume button image
    updateVolumeButton();
    // Function to handle volume control
    // function adjustVolume() {
    //     if (isMuted) {
    //         audioElement.volume = volumeBar.value / 100; // Set volume based on slider
    //        volumeButton.textContent = 'Volume'; // Update button text
    //         //volumeButton.src = 'Assets/mute.svg'; // Path to your mute image
    //         isMuted = false; // Unmute
    //     } else {
    //         audioElement.volume = 0; // Mute volume
    //         volumeButton.textContent = 'Unmute'; // Update button text
    //        // volumeButton.src = 'Assets/volumeup.svg'; // Path to your volume image
    //         isMuted = true; // Mute
    //     }
    // }
    

    // Function to update the now playing section with the current song info
    function updateNowPlaying(index) {
        songTitleElement.textContent = playAllSongs ? allSongs[index].title : albums[currentAlbumIndex].songs[index].title; // Set the title of the currently playing song
        currentTimeElement.textContent = '0:00'; // Reset the time display initially
        seekBar.max = audioElement.duration; // Set seek bar max value
    }

    // Function to update the current time display every second
    function updateNowPlayingTime() {
        timeUpdateInterval = setInterval(() => {
            if (!audioElement.paused) {
                const minutes = Math.floor(audioElement.currentTime / 60); // Calculate minutes
                const seconds = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0'); // Calculate seconds and pad with leading zero
                currentTimeElement.textContent = `${minutes}:${seconds}`; // Update the time display
                seekBar.value = audioElement.currentTime; // Update seek bar value
            }
        }, 1000); // Update every second
    }

    // Function to start updating the time display
    function startUpdatingTime() {
        if (!timeUpdateInterval) {
            updateNowPlayingTime();
        }
    }

    // Function to stop updating the time display
    function stopUpdatingTime() {
        clearInterval(timeUpdateInterval);
        timeUpdateInterval = null;
    }

    // Event listeners for player controls
    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', loadNextSong);
    previousButton.addEventListener('click', loadPreviousSong);
    backward10Button.addEventListener('click', backward10);
    forward10Button.addEventListener('click', forward10);
    shuffleButton.addEventListener('click', shuffleSongs);

    // Event listeners for seek bar
    seekBar.addEventListener('input', () => {
        audioElement.currentTime = seekBar.value; // Update the current time of the song based on seek bar
    });

    // Event listener for volume control
    // volumeButton.addEventListener('click', adjustVolume);
    // volumeBar.addEventListener('input', () => {
    //     if (!isMuted) {
    //         audioElement.volume = volumeBar.value / 100; // Update volume
    //     }
    // });

    // Event listener for end of song
    audioElement.addEventListener('ended', loadNextSong);

    // Event listener for showing all songs
    showAllSongsButton.addEventListener('click', showAllSongs);

    // Event listener for play all button
    playAllButton.addEventListener('click', playAll);

    // Load the albums initially
    loadAlbums();
});
