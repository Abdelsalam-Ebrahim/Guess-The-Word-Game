// Setting Game Name
let gameName = "Guess The Word";

document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created by Abdelsalam`;


// Setting Game Options
let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "School", "Pencil", "Sketch", "Hotels", "Mobils", "Laptop", "Phones"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

let meassgeArea = document.querySelector(".message");

// Mange Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInputs() {
    const inputsContainer = document.querySelector(".inputs");

    // Create Main Try Div
    for(let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i !== 1) tryDiv.classList.add("disabled-inputs");

        // Create Inputs
        for(let j = 1; j <= numberOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            tryDiv.append(input);
        }

        inputsContainer.append(tryDiv);
    }
    // Focus on First input in First try Element
    inputsContainer.children[0].children[1].focus();


    // Disable all inputs except first one  // When you press tab it go to disabled-inputs so this prevent it from happen
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => {input.disabled = true;});

    // Get all the inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Conver input to lowercase 
        input.addEventListener("input", function() {
            this.value = this.value.toLowerCase();

            // Go to next input field automatic
            const nextInput = inputs[index + 1];
            if(nextInput) nextInput.focus();
        });

        input.addEventListener("keydown", function(event) {
            // Get the index of the input that i focused in it
            const currentIndex = Array.from(inputs).indexOf(event.target);

            // Go to right by click on arrowright
            if(event.key == "ArrowRight") {
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus(); 
            }

            // Go t0 left by click on arrowleft
            if(event.key == "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if(prevInput >= 0) inputs[prevInput].focus(); 
            }
        });
    });
}

console.log(wordToGuess);

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;
    for(let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const correctLetter = wordToGuess[i - 1];

        if(letter == correctLetter) {
            inputField.classList.add("yes-in-place");
        } else if(wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else{ 
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    // Check if User won or lose

    if(successGuess) {
        meassgeArea.innerHTML= `You Win The Word Is <span>${wordToGuess}</span>`;
        
        if(numberOfHints == 2) {
            meassgeArea.innerHTML= `<p>Congratulations You Win, You Didn't Use Hints</p>`;
        }

        // add disabled-inputs class to all inputs 
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

        // Disable guess button
        guessButton.disabled = true;
        getHintButton.disabled = true;
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");

        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => input.disabled = true);

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach(input => input.disabled = false);
        
        let el = document.querySelector(`.try-${currentTry}`);

        if(el) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
            // Disabled Guess Button
            guessButton.disabled = true;
            getHintButton.disabled = true;
            
            meassgeArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
        }
    }
}

function getHint() {
    if(numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    } else {
        getHintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if(emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);


        if(indexToFill != -1) {
            randomInput.value = wordToGuess[indexToFill].toLowerCase();
        }
    }
}

function handleBackspace(event) {
    if(event.key == "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);

        if(currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];

            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
    generateInputs();
};