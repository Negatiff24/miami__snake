//флаги для выборов сложности и скина
let skinPicker = 1;
let difficultyPicker = 1;

//работы кнопок и переключения экранов
function onStartButtonClick() {
    document.getElementById('js-difficulty').classList.remove('-hidden');
    document.getElementById('js-greeting').classList.add('-hidden');
}

//сложности
function goMediumButtonClick() {
    difficultyPicker = 1;
    clearInterval(setInvalidId);
    setInvalidId = setInterval(initGame, 125);
    document.getElementById('js-skin').classList.remove('-hidden');
    document.getElementById('js-difficulty').classList.add('-hidden');
}

function goEasyButtonClick() {
    difficultyPicker = 2;
    clearInterval(setInvalidId);
    setInvalidId = setInterval(initGame, 210);
    document.getElementById('js-skin').classList.remove('-hidden');
    document.getElementById('js-difficulty').classList.add('-hidden');
}

function goHardButtonClick() {
    difficultyPicker = 3;
    clearInterval(setInvalidId);
    setInvalidId = setInterval(initGame, 62.5);
    document.getElementById('js-skin').classList.remove('-hidden');
    document.getElementById('js-difficulty').classList.add('-hidden');
}

//скины
function goNeonButtonClick() {
    skinPicker = 1;
    document.getElementById('js-game').classList.remove('-hidden');
    document.getElementById('js-skin').classList.add('-hidden');
}

function goGreenButtonClick() {
    const headElem = document.getElementById('js-head');
    if (headElem) { 
        headElem.classList.remove('-3');
        headElem.classList.add('-2');
        skinPicker = 2;
    } else {
        console.log("Element with ID 'js-head' not found in DOM");
    }
    document.getElementById('js-game').classList.remove('-hidden');
    document.getElementById('js-skin').classList.add('-hidden');
}

function goBlackButtonClick() {
    const headElem = document.getElementById('js-head');
    if (headElem) { 
        headElem.classList.remove('-2');
        headElem.classList.add('-3');
        skinPicker = 3;
    } else {
        console.log("Element with ID 'js-head' not found in DOM");
    }
    document.getElementById('js-game').classList.remove('-hidden');
    document.getElementById('js-skin').classList.add('-hidden');
}


const playBoard = document.querySelector(".game__board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setInvalidId;
let score = 0;

//счётчик
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Максимальный счёт: ${highScore}`;

//спавн еды
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setInvalidId);
    alert("шмэрть! жми ок чтоб вернуться на стартовый экран...");
    location.reload();
}

//движение змейки
const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

//старт игры
const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;//спавн еды

    //змея есть яблоко
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Счёт: ${score}`;
        highScoreElement.innerText = `Максимальный счёт: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;//смерть если уход за границы
    }

    snakeX += velocityX;
    snakeY += velocityY;

    //спавн головы и тела с учётом флага скина
    for (let i = 0; i < snakeBody.length; i++) {
        if (i === 0) {
            htmlMarkup += `<div class="head-${skinPicker}" id="js-head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        } else if (skinPicker === 2) {
            htmlMarkup += `<div class="body-${skinPicker}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        } else if (skinPicker === 3) {
            htmlMarkup += `<div class="body-${skinPicker}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        } else {
            htmlMarkup += `<div class="body-${skinPicker}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        
        if (i != 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
        
    playBoard.innerHTML = htmlMarkup;
}
        
changeFoodPosition();
//меняем скорость/сложность
if (difficultyPicker === 1) {
    setInvalidId = setInterval(initGame, 125);
} else if (difficultyPicker === 2) {
    setInvalidId = setInterval(initGame, 210);
} else if (difficultyPicker === 3) {
    setInvalidId = setInterval(initGame, 62.5);
}
document.addEventListener("keydown", changeDirection);