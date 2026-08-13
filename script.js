const lyricsElement = document.getElementById("lyrics");
const playBtn = document.getElementById("playBtn");

let lyrics = [];
let currentLine = 0;
let isPlaying = false;

const LINE_DURATION = 6000; // 6 seconds from first to last letter
const PAUSE_BETWEEN_LINES = 200;


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

        console.log("Loaded:", lyrics.length, "lines");

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

    if (isPlaying) return;

    if (lyrics.length === 0) {
        lyricsElement.textContent =
            "Lyrics are still loading...";
        return;
    }

    isPlaying = true;

    playBtn.style.display = "none";

    currentLine = 0;

    lyricsElement.innerHTML = "";

    typeNextLine();
});


// ==============================
// TYPE NEXT LINE
// ==============================

function typeNextLine() {

    if (!isPlaying) return;

    if (currentLine >= lyrics.length) {
        finish();
        return;
    }

    const text = lyrics[currentLine];

    // Create a NEW line.
    // Previous lines stay on screen.
    const lineElement = document.createElement("div");

    lineElement.className = "lyric-line";

    lyricsElement.appendChild(lineElement);

    let character = 0;

    /*
        IMPORTANT:

        The complete line takes 6 seconds.

        Example:
        30 characters

        6000 / 30
        = 200 milliseconds per character
    */

    const characterDelay =
        LINE_DURATION / text.length;


    function typeCharacter() {

        if (!isPlaying) return;

        if (character < text.length) {

            lineElement.textContent +=
                text.charAt(character);

            character++;

            // Keep the newest line visible
            lyricsElement.scrollTop =
                lyricsElement.scrollHeight;

            setTimeout(
                typeCharacter,
                characterDelay
            );

        } else {

            // The LAST character has appeared.
            // Wait briefly, then start next line.

            currentLine++;

            setTimeout(
                typeNextLine,
                PAUSE_BETWEEN_LINES
            );
        }
    }

    typeCharacter();
}


// ==============================
// FINISHED
// ==============================

function finish() {

    isPlaying = false;

    console.log("Lyrics finished.");
}


// ==============================
// LOAD
// ==============================

loadLyrics();
