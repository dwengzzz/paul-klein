const lyricsElement = document.getElementById("lyrics");
const replayButton = document.getElementById("replayBtn");

let lyrics = [];
let currentLine = 0;
let activeTimers = [];

const typingSpeed = 85; // slower typing
const lineDelay = 500;  // small pause after each line


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

        startTyping();

    } catch (error) {
        console.error(error);
        lyricsElement.textContent =
            "Could not load lyrics.txt";
    }
}


function typeLine(line) {

    lyricsElement.textContent = "";

    let character = 0;

    function typeCharacter() {

        if (character < line.length) {

            lyricsElement.textContent +=
                line.charAt(character);

            character++;

            setTimeout(
                typeCharacter,
                typingSpeed
            );

        } else {

            setTimeout(
                nextLine,
                lineDelay
            );
        }
    }

    typeCharacter();
}


function nextLine() {

    currentLine++;

    if (currentLine < lyrics.length) {

        typeLine(lyrics[currentLine]);

    } else {

        lyricsElement.textContent = "♡";
    }
}


function startTyping() {

    activeTimers.forEach(
        timer => clearTimeout(timer)
    );

    activeTimers = [];

    currentLine = 0;

    lyricsElement.textContent = "";

    if (lyrics.length > 0) {
        typeLine(lyrics[0]);
    }
}


replayButton.addEventListener(
    "click",
    startTyping
);


loadLyrics();
