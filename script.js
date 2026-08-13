const lyricsElement = document.getElementById("lyrics");
const replayButton = document.getElementById("replayBtn");

let lyrics = [];
let currentLine = 0;

const typingSpeed = 55;
const lineDelay = 900;


/* LOAD LYRICS */

async function loadLyrics() {

    try {

        const response = await fetch("lyrics.txt");

        if (!response.ok) {
            throw new Error("Lyrics file could not be loaded.");
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


/* TYPE ONE LINE */

function typeLine(line) {

    let character = 0;

    lyricsElement.textContent = "";

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


/* NEXT LINE */

function nextLine() {

    currentLine++;

    if (currentLine < lyrics.length) {

        typeLine(
            lyrics[currentLine]
        );

    } else {

        finishTyping();
    }
}


/* START */

function startTyping() {

    currentLine = 0;

    lyricsElement.textContent = "";

    if (lyrics.length > 0) {

        typeLine(
            lyrics[currentLine]
        );
    }
}


/* FINISH */

function finishTyping() {

    setTimeout(() => {

        lyricsElement.textContent = "♡";

    }, 500);
}


/* REPLAY */

replayButton.addEventListener(
    "click",
    startTyping
);


/* LOAD */

loadLyrics();
