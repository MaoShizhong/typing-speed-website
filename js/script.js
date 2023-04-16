import { words, shuffleWords } from './words.js';

const themeBtn = document.querySelector('#theme');
const durationBtns = document.querySelectorAll('#durations>button');
const instruction = document.querySelector('#caption');
const resetBtn = document.querySelector('#reset');
const textDisplay = document.querySelector('#text-display');
const input = document.querySelector('#text-entry');
const timer = document.querySelector('#timer');
const results = document.querySelector('#results');
const collapsibleBtn = document.querySelector('.collapsible');

// global arrays to compare for scoring
let charactersToCheckAgainst;
let charactersBeingEntered = [];

let duration;
let clock;
let testActive = false;
let selectedDuration = 60;
let timeRemaining = selectedDuration;
let firstLineCharLimit = 55;
let thirdLineCharLimit = 165;

themeBtn.addEventListener('click', changeTheme);
resetBtn.addEventListener('click', resetTest);
input.addEventListener('input', startTest);
input.addEventListener('input', updateTextDisplay);
collapsibleBtn.addEventListener('click', showContent);
durationBtns.forEach(button => button.addEventListener('click', setDuration));

function changeTheme() {
    const root = document.querySelector('html');
    root.classList.toggle('dark');
    root.classList.toggle('light');
}

function showContent(e) {
    const collapsibleContent = e.currentTarget.nextElementSibling;
    if (collapsibleContent.style.maxHeight) {
        collapsibleContent.style.maxHeight = null;
        e.currentTarget.textContent = 'How is this calculated? \u25BC';
    }
    else {
        collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`;
        e.currentTarget.textContent = 'How is this calculated? \u25B2';
    }
}

function generateWordList() {
    shuffleWords(words);
    const testChars = words.slice(0, 250).join(' ').split('');
    textDisplay.replaceChildren();
    appendCharDivs(testChars);

    // populate global array for scoring after test
    charactersToCheckAgainst = testChars;
}

function appendCharDivs(chars) {
    for (let i = 0; i < chars.length; i++) {
        const charDiv = document.createElement('div');
        charDiv.className = 'char';
        charDiv.textContent = chars[i];
        textDisplay.appendChild(charDiv);
    }
    textDisplay.firstChild.style.borderBottom = '2px solid var(--font)';
}

function setDuration(e) {
    selectedDuration = e.target.value;
    timeRemaining = selectedDuration;
    timer.textContent = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`;

    // change visuals
    const currentSelection = document.querySelector('.current');
    currentSelection.classList.remove('current');
    e.target.classList.add('current');
}

function startTest() {
    if (!testActive) {
        testActive = true;
        clock = setInterval(updateTimer, 1000);
        duration = setTimeout(showResults, selectedDuration * 1000);
        instruction.classList.add('hidden');
        resetBtn.classList.remove('hidden');
    }
}

function updateTimer() {
    timeRemaining--;
    timer.textContent = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`;
}

function updateTextDisplay(e) {
    // to catch CTRL+A backspace or other complete clears
    if (input.value === '') {
        charactersBeingEntered = [];
        clearAllHighlighting();
        return;
    }

    if (e.inputType === 'deleteContentBackward') {
        charactersBeingEntered.pop();
        clearLastHighlight();
    }
    else {
        charactersBeingEntered.push(input.value.slice(-1));
        highlightText();
    }

    checkProgressToScroll();
}

function clearAllHighlighting() {
    const chars = textDisplay.querySelectorAll('div');
    chars.forEach(div => div.removeAttribute('style'));
    textDisplay.firstChild.style.borderBottom = '2px solid var(--font)';
}

function clearLastHighlight() {
    const i = charactersBeingEntered.length;
    const char = textDisplay.querySelector(`:nth-child(${i + 1})`);
    char.removeAttribute('style');
    char.style.borderBottom = '2px solid var(--font)';
    char.nextSibling.style.borderBottom = null;
}

function highlightText() {
    const i = charactersBeingEntered.length - 1;
    const char = textDisplay.querySelector(`:nth-child(${i + 1})`);

    if (charactersBeingEntered[i] === charactersToCheckAgainst[i]) {
        char.style.color = '#1a8cff';
    }
    else {
        char.style.color = '#800000';
        char.style.backgroundColor = '#f2a2a0';
    }
    // move "cursor"
    char.style.borderBottom = null;
    char.nextSibling.style.borderBottom = '2px solid var(--font)';
}

function checkProgressToScroll() {
    // char limit for 3 lines in text display
    const finalSpaceOnFirstLine = charactersToCheckAgainst.lastIndexOf(' ', firstLineCharLimit) + 1;
    const finalSpaceOnThirdLine = charactersToCheckAgainst.lastIndexOf(' ', thirdLineCharLimit) + 1;

    if (textDisplay.querySelector(`:nth-child(${finalSpaceOnThirdLine})`).style.borderBottom === '2px solid var(--font)') {
        const divs = textDisplay.querySelectorAll('div');
        for (let i = 0; i < finalSpaceOnFirstLine; i++) {
            divs[i].style.display = 'none';
        }
        firstLineCharLimit += 55;
        thirdLineCharLimit += 55;
    }
}

function showResults() {
    input.disabled = true;
    clearInterval(clock);

    calculateStats();
    timer.classList.toggle('hidden');
    results.classList.toggle('hidden');
}

function calculateStats() {
    const chars = charactersBeingEntered.length;
    if (chars === 0) {
        document.querySelector('#wpm').textContent = '0';
        document.querySelector('#accuracy').textContent = '0%';
        document.querySelector('#errors').textContent = '0';
        return;
    }

    const errors = charactersBeingEntered.filter((c, i) => c !== charactersToCheckAgainst[i]).length;
    const accuracy = (chars - errors) / chars;
    const accuracyPercent = Math.round(accuracy * 1000) / 10;
    const wpm = chars / 5 * (1 / (selectedDuration / 60)) * accuracy;

    // display stats
    document.querySelector('#wpm').textContent = `${Math.round(wpm)}`;
    document.querySelector('#accuracy').textContent = `${accuracyPercent === 100 ? 100 : String(accuracyPercent).padEnd(4, '.0')}%`;
    document.querySelector('#errors').textContent = `${errors}`;
}

function resetTest() {
    timeRemaining = selectedDuration;
    timer.textContent = `${Math.floor(timeRemaining / 60)}:${String(timeRemaining % 60).padStart(2, '0')}`;
    testActive = false;
    input.disabled = false;
    firstLineCharLimit = 55;
    thirdLineCharLimit = 165;

    generateWordList();
    charactersBeingEntered = [];
    input.value = '';
    input.focus();

    timer.classList.remove('hidden');
    results.classList.add('hidden');
    instruction.classList.toggle('hidden');
    resetBtn.classList.toggle('hidden');
    clearTimeout(duration);
    clearInterval(clock);
}

// initialise
generateWordList();