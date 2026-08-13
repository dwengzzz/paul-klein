const lyricsElement = document.getElementById("lyrics");
const playBtn = document.getElementById("playBtn");

let lyrics = [];
let currentLine = 0;
let isPlaying = false;

const LINE_DURATION = 5000; // EXACTLY 5 seconds per line
const PAUSE_BETWEEN_LINES = 200; // small pause before next line


// ==============================
// LOAD LYRICS
// ==============================

async function loadLyrics() {
    try {
        const response = await fetch("lyrics.txt");

        if (!response.ok) {
            throw new Error("Could not load lyrics.txt");
        }

        const text = await response.text();

        lyrics = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        console.log("Lyrics loaded:", lyrics.length);

    } catch (error) {
        console.error(error);

        lyricsElement.textContent =
            "Could not load lyrics.txt";
    }
}


// ==============================
// PLAY BUTTON
// ==============================

playBtn.addEventListener("click", () => {

    if (isPlaying) {
        return;
    }

    if (lyrics.length === 0) {
        lyricsElement.textContent =
            "Lyrics are still loading...";
        return;
    }

    isPlaying = true;

    // Hide the button
    playBtn.style.display = "none";

    // Start from first line
    currentLine = 0;

    lyricsElement.textContent = "";

    showNextLine();
});


// ==============================
// SHOW NEXT LINE
// ==============================

function showNextLine() {

    if (!isPlaying) {
        return;
    }

    if (currentLine >= lyrics.length) {
        finishTyping();
        return;
    }

    typeLine(lyrics[currentLine]);
}


// ==============================
// TYPE ONE LINE
// ==============================

function typeLine(line) {

    lyricsElement.textContent = "";

    let character = 0;

    /*
        The entire line takes exactly
        5 seconds to type.

        Example:

        20 characters
        5000 ÷ 20
        = 250ms per character
    */

    const characterDelay =
        LINE_DURATION / line.length;


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
                characterDelay
            );

        } else {

            // The complete line has now
            // taken approximately 5 seconds.

            setTimeout(() => {

                currentLine++;

                showNextLine();

            }, PAUSE_BETWEEN_LINES);
        }
    }


    typeCharacter();
}


// ==============================
// FINISHED
// ==============================

function finishTyping() {

    isPlaying = false;

    lyricsElement.textContent = "♡";
}


// ==============================
// LOAD
// ==============================

loadLyrics();
