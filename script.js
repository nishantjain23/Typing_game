const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present';
const wordsArray = words.split(' ');
const wordsCount = wordsArray.length;
const gameTimer = 30 * 1000;
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

function addclass(el, name) {
    el.className += ' ' + name;
}

function removeclass(el, name) {
    el.className = el.className.replace(name, '');
}

function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordsCount);
    return wordsArray[randomIndex - 1];
}

function formatword(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatword(randomWord());
    }
    addclass(document.querySelector('.word'), 'current');
    addclass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = (gameTimer / 1000) + '';
    window.timer = null;
}

function getwpm() {
    const words = [...document.querySelectorAll('.word')];
    const lasttyped = document.querySelector('.word.current');
    const lasttypedIndex = words.indexOf(lasttyped) + 1;
    const typedWords = words.slice(0, lasttypedIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTimer * 60000;
}

function gameover() {
    clearInterval(window.timer);
    addclass(document.getElementById('game'), 'over');
    const result = getwpm();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentword = document.querySelector('.word.current');
    const currentletter = document.querySelector('.letter.current');
    const expected = currentletter ? currentletter.innerHTML : '';
    const isletter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstletter = currentletter === currentword.firstChild;

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log({ key, expected });

    if (!window.timer && isletter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = Math.round((gameTimer / 1000) - sPassed);
            if (sLeft <= 0) {
                gameover();
                return;
            }
            document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
    }

    if (isletter) {
        if (currentletter) {
            addclass(currentletter, key === expected ? 'correct' : 'incorrect');
            removeclass(currentletter, 'current');
            if (currentletter.nextSibling) {
                addclass(currentletter.nextSibling, 'current');
            }
        }
        else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentword.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const invalidLetter = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            invalidLetter.forEach(letter => {
                addclass(letter, 'incorrect');
            });
        }
        removeclass(currentword, 'current');
        addclass(currentword.nextSibling, 'current');
        if (currentletter) {
            removeclass(currentletter, 'current');
        }
        addclass(currentword.nextSibling.firstChild, 'current');
    }

    if (isBackspace) {
        if (currentletter && isFirstletter) {
            // move prev word curent, last letter curent
            removeclass(currentword, 'current');
            addclass(currentword.previousSibling, 'current');
            removeclass(currentletter, 'current');
            addclass(currentword.previousSibling.lastChild, 'current');
            removeclass(currentword.previousSibling.lastChild, 'incorrect');
            removeclass(currentword.previousSibling.lastChild, 'correct');
        }
        if (currentletter && !isFirstletter) {
            // move back one letter, invalidate letter
            removeclass(currentletter, 'current');
            addclass(currentletter.previousSibling, 'current');
            removeclass(currentletter.previousSibling, 'incorrect');
            removeclass(currentletter.previousSibling, 'correct');
        }
        if (!currentletter) {
            addclass(currentword.lastChild, 'current');
            removeclass(currentword.lastChild, 'incorrect');
            removeclass(currentword.lastChild, 'correct');
        }
    }
    // move lines/words
    if (currentword.getBoundingClientRect().top > 300) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    gameover();
    newGame();
});

newGame();