function onStartButtonClick() {
    document.getElementById('js-game').classList.remove('-hidden');
    document.getElementById('js-greeting').classList.add('-hidden');
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

//берём макс рез из хранилища
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Максимальный счёт: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    //перезагружаем после проигрыша
    clearInterval(setInvalidId);
    alert("шмэрть! жми ок чтоб вернуться на стартовый экран...");
    location.reload();
}

const changeDirection = (e) => {
    //дижение
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
    //присваиваем движение кнопкам
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //проверка косания змеи еды
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //двигаем позицию еды в тело змеи
        score++; //увел счёта на 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Счёт: ${score}`;
        highScoreElement.innerText = `Максимальный счёт: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //двигаем вперёд значения елемов в теле змеи
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; //ставим первый элем в текущею позицию

    //чекаем не за стеной ли голова змеи, еси да то шмэрть
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    //обновление позиции головы
    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = 0; i < snakeBody.length; i++) {
        //добавляем див за каждую часть тела змеи
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //смерть если бьётся о себя
        if(i != 0 && snakeBody[0][1] ===snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setInvalidId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);