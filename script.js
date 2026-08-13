const lyricsElement = document.getElementById("lyrics");
const playBtn = document.getElementById("playBtn");

let lyrics = [];
let currentLine = 0;
let isPlaying = false;

const typingSpeed = 85;
const lineDelay = 500;


/* LOAD LYRICS */

async function loadLyrics() {

    try {

        const response = await fetch("lyrics.txt");

        if (!response.ok) {
            throw new Error("lyrics.txt could not be loaded.");
        }

        const text = await response.text();

        lyrics = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line !== "");

        console.log("Lyrics loaded:", lyrics.length);

    } catch (error) {

        console.error(error);

        lyricsElement.textContent =
            "Lyrics could not be loaded.";

    }
}


/* PLAY */

playBtn.addEventListener("click", () => {

    // Prevent clicking multiple times
    if (isPlaying) {
        return;
    }

    // Make sure lyrics have loaded
    if (lyrics.length === 0) {
        lyricsElement.textContent =
            "Please wait for the lyrics to load.";
        return;
    }

    isPlaying = true;

    // Hide play button
    playBtn.style.display = "none";

    // Start from the beginning
    currentLine = 0;

    lyricsElement.textContent = "";

    typeLine();

});


/* TYPE LINE */

function typeLine() {

    if (!isPlaying) {
        return;
    }

    if (currentLine >= lyrics.length) {

        finish();

        return;
    }

    const line = lyrics[currentLine];

    lyricsElement.textContent = "";

    let character = 0;


    function typeCharacter() {

        if (!isPlaying) {
            return;
        }

        if (character < line.length) {

            lyricsElement.textContent +=
                line.charAt(character);

            character++;

            setTimeout(
                typeCharacter,
                typingSpeed
            );

        } else {

            setTimeout(() => {

                currentLine++;

                typeLine();

            }, lineDelay);

        }

    }

    typeCharacter();

}


/* FINISH */

function finish() {

    isPlaying = false;

    lyricsElement.textContent = "♡";

}
    

/* LOAD THE LYRICS */

loadLyrics();
