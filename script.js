const lyricsElement = document.getElementById("lyrics");
const playBtn = document.getElementById("playBtn");

let lyrics = [];
let currentLine = 0;
let isPlaying = false;

const LINE_DURATION = 4000; // 4 seconds for EVERY whole line
const PAUSE_BETWEEN_LINES = 300; // 0.3 second pause


// LOAD LYRICS
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

        console.log("Loaded lines:", lyrics.length);

    } catch (error) {
        console.error(error);

        lyricsElement.textContent =
            "Could not load lyrics.txt";
    }
}


// PLAY BUTTON
playBtn.addEventListener("click", () => {

    if (isPlaying) return;

    if (lyrics.length === 0) {
        lyricsElement.textContent =
            "Lyrics are still loading...";
        return;
    }

    isPlaying = true;

    // Hide button after clicking
    playBtn.style.display = "none";

    currentLine = 0;

    lyricsElement.textContent = "";

    showNextLine();
});


// SHOW NEXT LINE
function showNextLine() {

    if (!isPlaying) return;

    if (currentLine >= lyrics.length) {
        finishTyping();
        return;
    }

    const line = lyrics[currentLine];

    typeLine(line);
}


// TYPE ONE COMPLETE LINE IN EXACTLY 4 SECONDS
function typeLine(line) {

    lyricsElement.textContent = "";

    let character = 0;

    // Calculate how many milliseconds
    // each character gets.

    const characterDelay =
        LINE_DURATION / line.length;


    function typeCharacter() {

        if (!isPlaying) return;

        if (character < line.length) {

            lyricsElement.textContent +=
                line.charAt(character);

            character++;

            setTimeout(
                typeCharacter,
                characterDelay
            );

        } else {

            // Line is completely typed.
            // Wait a tiny bit, then move on.

            setTimeout(() => {

                currentLine++;

                showNextLine();

            }, PAUSE_BETWEEN_LINES);
        }
    }


    typeCharacter();
}


// WHEN EVERYTHING IS FINISHED
function finishTyping() {

    isPlaying = false;

    lyricsElement.textContent = "♡";
}


// LOAD THE LYRICS
loadLyrics();
