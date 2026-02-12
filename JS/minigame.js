const gameArea = document.querySelector('#game-area');
const sequenceSpan = document.querySelector('#sequence');
const currentTask = document.querySelector('#task');
const timeDisplay = document.querySelector('#time');
const pointsSpan = document.querySelector('#score');
const controlButtonsDiv = document.querySelector('#control-buttons');
const successSound = document.querySelector('#successSound');
const errorSound = document.querySelector('#errorSound');


const totalFigures = 15;
let figures = [];
let nextNumber; // Следующая ожидаемая цифра
let resultSequence = [];
let gameVariant; // Вариант игры
let correctSequence = []; // правильная последовательность для победы
let currentLevel = 1; // текущий уровень
let variantNumbers = [0, 1, 2, 3, 4, 5]; // Номер варианта
let difficultyLevel = 1; // уровень сложности

// Подсчет очков
let points = 0;
pointsSpan.textContent = `Очки: ${points}`;

// Варианты заданий
const variants = [
  'Соберите последовательность всех чисел по возрастанию',
  'Соберите последовательность всех чисел по убыванию',
  'Соберите последовательность чётных чисел по возрастанию',
  'Соберите последовательность чётных чисел по убыванию',
  'Соберите последовательность нечётных чисел по возрастанию',
  'Соберите последовательность нечётных чисел по убыванию'
];


  // Выбираем случайный вариант
function chooseVariant() {
  const variantNumber = Math.floor(Math.random() * variants.length);
  return variantNumber;
}

// Создаем правильную последовательность для победы
function createCorrectSequence() {
  let seq = [];
  for (let i = 1; i <= totalFigures; i++) {
    switch (gameVariant) {
      case 0:   // подряд возрастание
        seq.push(i); 
        break;
      case 1:   // подряд убывание
        seq.push(i);
        break;
      case 2:   // чётные возрастане
        if (i % 2 === 0) seq.push(i);
        break;
      case 3:   // чётные убывание
        if (i % 2 === 0) seq.push(i);
        break;
      case 4:   // нечётные возрастане
        if (i % 2 !== 0) seq.push(i);
        break;
      case 5:   // нечётные убывание
        if (i % 2 !== 0) seq.push(i);
        break;
    }
  }
  // Обработка вариантов "обратное"
  if (gameVariant == 1 || gameVariant == 3 || gameVariant == 5) {
    seq.reverse();
  }
  return seq;
}

// Функции для перемешивания массива
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Таймер
let timerInterval;
let totalTime = 120; // секунд

function startTimer() {
  timeDisplay.textContent = formatTime(totalTime);
  timerInterval = setInterval(() => {
    totalTime--;
    timeDisplay.textContent = formatTime(totalTime);
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      endGame(0);
    }
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Получаем уровень сложности из окна логина
window.onload = () => {
  // Получаем уровень сложности из localStorage
  const storedDifficulty = localStorage.getItem('difficultyLevel');
  if (storedDifficulty !== null) {
    difficultyLevel = parseInt(storedDifficulty);
  }
  const showControls = localStorage.getItem('showControls') === 'true';
  const controlButtonsDiv = document.getElementById('control-buttons');
  if (showControls) {
    controlButtonsDiv.style.display = 'block';
  } else {
   controlButtonsDiv.style.display = 'none';
  }
};


/******************************************************/
                  /*** Уровень 1 ***/

// Генерируем и располагаем фигуры
function generateFigures() {
  figures = [];
  resultSequence = [];
  nextNumber = 1;
  sequenceSpan.textContent = '';

  // Очищаем игровую зону
  gameArea.innerHTML = '';

  // Создаем правильную последовательность для проверки
  correctSequence = createCorrectSequence();

  // Создаем массив чисел (от 1 до 15)
  const allNumbers = [totalFigures];
  for (let i = 0; i < totalFigures; i++)
    allNumbers[i] = i + 1;
  // Перемешиваем для случайного расположения
  shuffle(allNumbers);

  // Создаем фигуры
  let stepW = 0;
  let stepH = 0;
  for (let num of allNumbers) {
    if (stepW > 3) {
      stepH++;
      stepW = 0;
    }
    if (stepH > 3) {
      stepH = 0;
    }
    const figure = document.createElement('div');
    figure.className = 'figure';
    figure.textContent = num;
    // Располагаем в случайных позициях
    const posX = Math.random() * (gameArea.clientWidth / 4 - 50) + gameArea.clientWidth / 4 * stepW;
    const posY = Math.random() * (gameArea.clientHeight / 4 - 50) + gameArea.clientHeight / 4 * stepH;
    figure.style.left = posX + 'px';
    figure.style.top = posY + 'px';
    stepW++;

    // Обработчик двойного клика
    figure.ondblclick = () => handleDoubleClick(figure, num);

    gameArea.appendChild(figure);
    figures.push({ element: figure, number: num });
  }
}

// Двойной клик
function handleDoubleClick(figure, num) {
  if (num === correctSequence[nextNumber - 1]) {
    // Правильный выбор
    // Звук успеха
    if (successSound) {
      successSound.currentTime = 0; // сбросить воспроизведение
      successSound.play(); // воспроизвести
    }
    // Очки
    points += 2 * difficultyLevel;
    pointsSpan.textContent = `Очки: ${points}`;
    // Анимация исчезновения
    figure.style.transition = 'all 0.5s ease-in';
    figure.style.transform = 'translateY(600px) rotate(20deg)';
    figure.style.opacity = '0';
    // После анимации удалить элемент
    setTimeout(() => { figure.remove(); }, 500);

    resultSequence.push(num);
    sequenceSpan.textContent = resultSequence.join(', ');

    // Обновляем следующий номер
    nextNumber++;

    // Проверка завершения раунда
    if (nextNumber > correctSequence.length) {
      // Анимация
      createMoreConfetti(3);
      // Увеличиваем очки
      points += 50 * difficultyLevel;
      pointsSpan.textContent = `Очки: ${points}`;
      sequenceSpan.textContent = '';
      transitionAnimation();

      // Проверка завершения всех вариантов
      if (variantNumbers.length === 0) {
        setTimeout(() => { endGame(1); }, 500);
      } 
      else {
        // Запуск следующего варианта
        setTimeout(() => { startRoundLevel1(); }, 500);
        totalTime += 30 / difficultyLevel;
      }
    }
  }
  else {
    // Неправильный выбор
    // Звук ошибки
    if (errorSound) {
      errorSound.currentTime = 0;
      setTimeout(() => { errorSound.play(); }, 100);
    }
    // Уменьшаем очки
    points -= 10 * difficultyLevel;
    if (points < 0) points = 0; // чтобы не было отрицательных очков
    pointsSpan.textContent = `Очки: ${points}`;

    // Анимация моргания
    // Сохранение исходного вида
    const originalStyle = {
      backgroundColor: figure.style.backgroundColor,
      transform: figure.style.transform,
    };
    // Мигать красным
    let flickCount = 0;
    const flickInterval = setInterval(() => {
      figure.style.backgroundColor = (flickCount % 2 === 0) ? 'red' : originalStyle.backgroundColor;
      figure.style.transform = (flickCount % 2 === 0) ? 'scale(1.1)' : originalStyle.transform;

      flickCount++;
      if (flickCount >= 4) {
        clearInterval(flickInterval);
        // Вернуть к исходному виду
        figure.style.backgroundColor = originalStyle.backgroundColor;
        figure.style.transform = originalStyle.transform;
      }
    }, 100);
  }
}

//Новый раунд
function startRoundLevel1() {
  gameVariant = variantNumbers.shift();
  currentTask.textContent = variants[gameVariant];
  generateFigures();
}

// Инициализация игры
function initLevel1() {
  variantNumbers = [0, 1, 2, 3, 4, 5]
  shuffle(variantNumbers);
  startRoundLevel1();
  totalTime = 120 / difficultyLevel;
  startTimer();
  // сброс очков и других переменных
  pointsSpan.textContent = `Очки: ${points}`;
}













/*****************************************************/
                /*** Уровень 2 ***/


// Падение фигур и перетаскивание

// Добавление области для перетаскивания фигур
const dropArea = document.createElement('div');
dropArea.id = 'drop-area';
dropArea.innerHTML = '<strong>Перетащите фигуры сюда</strong>';

function addDropArea() {
document.body.appendChild(dropArea);
}

// Функция для бесконечного падения отдельной фигуры
function startFallingCycle(figure) {
  const fallSpeed = Math.random() * 2; // скорость падения
  const swayAmplitude = 20; // амплитуда качания (в px)
  const swaySpeed = 0.1; // скорость качания (чем больше, тем быстрее)

  let currentTop = -55; // стартовая позиция
  let swayOffset = 0; // текущий смещение качания
  let swayPhase = 0; // переменная для отслеживания фазы качания

  // Начинаем цикл падения
  function fall() {
    currentTop = -55;
    figure.style.top = currentTop + 'px';

    // Начальная позиция left
    const baseLeft = parseFloat(figure.style.left) || 0;

    const fallInterval = setInterval(() => {
      // Обновляем вертикальную позицию
      currentTop += fallSpeed + difficultyLevel;
      figure.style.top = currentTop + 'px';

      // Обновляем горизонтальную позицию по синусоиде для качания
      swayPhase += swaySpeed;
      swayOffset = swayAmplitude * Math.sin(swayPhase);
      figure.style.left = (baseLeft + swayOffset) + 'px';

      // Проверка выхода за границы
      if (currentTop > gameArea.clientHeight) {
        clearInterval(fallInterval);
        // Перезапуск цикла с задержкой
        setTimeout(() => {
          fall();
        }, 200);  // задержка перед перезапуском (мс)
      }
    }, 30);
  }

  fall();
}


// Создание падающих фигур
function generateFallingFigures() {
  // Удаляем старые фигуры
  figures.forEach(f => f.element.remove());
  figures = [];
  sequenceSpan.textContent = '';
  resultSequence = [];
  

  // Создаем правильную последовательность
  correctSequence = createCorrectSequence();

  // Создаем массив чисел (от 1 до 15)
  const allNumbers = [totalFigures];
  for (let i = 0; i < totalFigures; i++)
    allNumbers[i] = i + 1;
  // Перемешиваем для случайного расположения
  shuffle(allNumbers);

  // Создаем фигуры и запускаем их падение
  for (let i = 0; i < allNumbers.length; i++) {
    const num = allNumbers[i];
    const figure = document.createElement('div');
    figure.className = 'figure';
    figure.textContent = num;

    // Начальная позиция сверху
    figure.style.position = 'absolute';
    figure.style.left = Math.random() * (gameArea.clientWidth - 200) + 100 + 'px';
    figure.style.top = '-55px';

    // Сделать фигуру перетаскиваемой
    figure.draggable = true;
    figure.style.transition = 'none';
    figure.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', num);
    };

    gameArea.appendChild(figure);
    figures.push({element: figure, number: num});

    // Запускаем цикл падения с задержкой
    setTimeout(() => startFallingCycle(figure), i * 600);
  }
}


// Обработка сброса фигуры в область
dropArea.ondragover = (e) => {
  e.preventDefault();
};
dropArea.ondrop = (e) => {
  e.preventDefault();
  // получаем номер перетаскиваемой фигуры
  const num = parseInt(e.dataTransfer.getData('text/plain'));
  if (num == correctSequence[0]) {
    // Звук успеха
    if (successSound) {
      successSound.currentTime = 0; // сбросить воспроизведение
      successSound.play(); // воспроизвести
    }
    // Зона загорается зеленым на 0,2 секунды
    dropArea.style.backgroundColor = 'green';
    points += 3 * difficultyLevel;
    pointsSpan.textContent = `Очки: ${points}`;
    // Находим фигуру по номеру
    const figure = figures.find(f => f.element.textContent == num)?.element;
    figure.remove();
    // Удаляем из массива падающих фигур
    figures = figures.filter(f => f.element !== figure);

    // Добавляем в собранную последовательность
    resultSequence.push(correctSequence.shift());
    sequenceSpan.textContent = resultSequence.join(', ');

    // Проверка завершения раунда
    if (correctSequence.length === 0) {
      // Анимация
      createMoreConfetti(3);
      points += 50 * difficultyLevel;
      pointsSpan.textContent = `Очки: ${points}`;

      // Очистка для следующего раунда
      resultSequence = [];
      sequenceSpan.textContent = '';
      transitionAnimation();

      if (variantNumbers.length === 0) {
        setTimeout(() => { endGame(1); }, 500); // завершение игры
      }
      else {
        setTimeout(() => { startRoundLevel2(); }, 500); // новый раунд
        totalTime += 42 / difficultyLevel;
      }
    }
  }
  else {
    // Неправильный выбор
    // Звук ошибки
    if (errorSound) {
      errorSound.currentTime = 0;
      errorSound.play();
    }
    // Зона загорается красным на 0,2 секунды
    dropArea.style.backgroundColor = 'red';
    // Уменьшаем очки
    points -= 10 * difficultyLevel;
    if (points < 0) points = 0; // чтобы не было отрицательных очков
    pointsSpan.textContent = `Очки: ${points}`;
  }
  // Возврат к исходному цвету через секунду
  setTimeout(() => {
    dropArea.style.backgroundColor = '';
  }, 200);
};

// Новый раунд
function startRoundLevel2() {
  gameVariant = variantNumbers.shift();
  currentTask.textContent = variants[gameVariant];
  generateFallingFigures();
}

// Инициализация уровня с падением
function initLevel2() {
  variantNumbers = [0, 1, 2, 3, 4, 5]
  shuffle(variantNumbers);
  addDropArea();
  startRoundLevel2();
  totalTime = 180 / difficultyLevel;
  startTimer();
  pointsSpan.textContent = `Очки: ${points}`;
}













/*****************************************************/
                /*** Уровень 3 ***/


const size = 4;
const totalTiles = size * size;
let emptyIndex = 0;
let nextToExit;
const lastIndex = size * size - 1;
let bonusPoints;
let tiles = [totalTiles];

// Добавляем область для игры
const board = document.createElement('div');
board.id = 'board';

function addBoard() {
  gameArea.appendChild(board);
}

function generateTileFigures() {
  // удаляем старые данные
  sequenceSpan.textContent = '';
  resultSequence = [];

  // Создаем правильную последовательность
  correctSequence = createCorrectSequence();
  // Считаем максимум бонусных очков
  bonusPoints = 15 * correctSequence.length;

  tiles = [totalTiles];
  for (let i = 0; i < totalTiles; i++)
    tiles[i] = i;
  // Перемешиваем для случайного расположения
  shuffle(tiles);
  // ищем пустую клетку (номер 0)
  emptyIndex = tiles.indexOf(0);
  // устанавливаем nextToExit
  nextToExit = correctSequence.shift();
  renderTiles();
}

// Генерация плиток на доске
function renderTiles() {
  figures.forEach(f => f.element.remove());
  figures = [];
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 50px)`;
  for (let i = 0; i < tiles.length; i++) {
    const num = tiles[i];
    const figure = document.createElement('div');
    figure.className = 'figure';
    figure.style.position = 'relative';
    if (num === 0) {
      figure.textContent = '';
      figure.style.backgroundColor = "#fff";
    }
    else if (num === '✔️') {
      figure.textContent = '✔️';
    }
    else {
      figure.textContent = num;
    }
    if (i === tiles.length - 1) {
      figure.style.border = '2px solid #ff4444cc'
    }

    board.appendChild(figure);
    figures.push({element: figure, number: num});
  }
}

function moveTile(targetIndex) {
  const rowDiff = Math.abs(Math.floor(targetIndex / size) - Math.floor(emptyIndex / size));
  const colDiff = Math.abs((targetIndex % size) - (emptyIndex % size));
  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    // Перемещаем
    let tmp = tiles[emptyIndex];
    tiles[emptyIndex] = tiles[targetIndex];
    tiles[targetIndex] = tmp;
    // [tiles[emptyIndex], tiles[targetIndex]] = [tiles[targetIndex], tiles[emptyIndex]];
    emptyIndex = targetIndex;
    renderTiles();

    // после перемещения проверяем правый нижний угол
    checkBottomRight();
  }
}

function checkBottomRight() {
  const val = tiles[lastIndex];

  if (val === nextToExit) {
    // Звук успеха
    if (successSound) {
      successSound.currentTime = 0; // сбросить воспроизведение
      successSound.play(); // воспроизвести
    }
    // Помечаем засчитанной
    tiles[lastIndex] = '✔️';
    // Добавляем очки
    points += 5 * difficultyLevel;
    pointsSpan.textContent = `Очки: ${points}`;

    // Добавляем в собранную последовательность
    resultSequence.push(val);
    sequenceSpan.textContent = resultSequence.join(', ');

    renderTiles();

    // Проверка завершения раунда
    if (correctSequence.length === 0) {
      // Анимация
      createMoreConfetti(3);

      // Добавляем очки
      if (bonusPoints < 0) {
        bonusPoints = 0;
      }
      points += bonusPoints * difficultyLevel;
      points += 100 * difficultyLevel;
      pointsSpan.textContent = `Очки: ${points}`;

      // Очистка для следующего раунда
      resultSequence = [];
      sequenceSpan.textContent = '';
      transitionAnimation();
      
      if (variantNumbers.length === 0) {
        setTimeout(() => {endGame(1); }, 500);
      }
      else {
        setTimeout(() => {startRoundLevel3(); }, 500); // новый раунд
        totalTime += 90 / difficultyLevel;
      }
    }
    else {
      nextToExit = correctSequence.shift();
    }
  }
}

// Обработчик клавиш стрелок
document.addEventListener('keydown', (e) => {
  let targetIndex = null;
  switch(e.key) {
    case 'ArrowUp':
      targetIndex = emptyIndex + size; // вверх — ячейка снизу
      break;
    case 'ArrowDown':
      targetIndex = emptyIndex - size; // вниз — ячейка сверху
      break;
    case 'ArrowLeft':
      targetIndex = emptyIndex + 1; // влево — ячейка справа
      break;
    case 'ArrowRight':
      targetIndex = emptyIndex - 1; // вправо — ячейка слева
      break;
  }
  if (targetIndex !== null && targetIndex >= 0 && targetIndex < totalTiles) {
    // Проверка границ по строкам и столбцам
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    const targetRow = Math.floor(targetIndex / size);
    const targetCol = targetIndex % size;

    if ((Math.abs(targetRow - emptyRow) === 1 && targetCol === emptyCol) ||
      (Math.abs(targetCol - emptyCol) === 1 && targetRow === emptyRow)) {
      moveTile(targetIndex);
      // Снижаем бонусные очки
      bonusPoints--;
    }
  }
});

// Новый раунд
function startRoundLevel3() {
  gameVariant = variantNumbers.shift();
  currentTask.textContent = variants[gameVariant];
  generateTileFigures();
}

// Инициализация уровня с пятнашками
function initLevel3() {
  variantNumbers = [0, 1, 2, 3, 4, 5]
  shuffle(variantNumbers);
  addBoard()
  startRoundLevel3();
  totalTime = 600 / difficultyLevel;
  startTimer();
  pointsSpan.textContent = `Очки: ${points}`;
}










/*************************************************************/
              /*** Дополнительные функции ***/

// Показ инструкции к уровню
function showLevelIntro(level) {
  // Создаем оверлей
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  // Номер уровня
  const levelNumber = document.createElement('h1');
  levelNumber.textContent = `Уровень ${level}`;
  levelNumber.style.color = 'white';
  overlay.appendChild(levelNumber);

  // Правила
  const rulesText = document.createElement('p');
  rulesText.style.color = 'white';
  rulesText.style.fontSize = '20px';
  rulesText.style.textAlign = 'center';

  switch(level) {
    case 1:
      rulesText.textContent = 'Выбирайте нужные числа двойным кликом мыши';
      break;
    case 2:
      rulesText.textContent = 'Перетаскивайте мышкой нужные числа в область внизу экрана';
      break;
    case 3:
      rulesText.textContent = 'Двигайте числа стрелками на клавиатуре. Переместите нужные числа в правый нижний квадрат.';
      break;
  }
  overlay.appendChild(rulesText);

  // Кнопка начать
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Начать';
  startBtn.style.padding = '10px 20px';
  startBtn.style.fontSize = '18px';
  overlay.appendChild(startBtn);

  document.querySelector('#game-area').appendChild(overlay);

  startBtn.onclick = () => {
    // Удалить оверлей
    overlay.remove();
    // Показать отсчет
    showCountDown(level);
  };
}

function showCountDown(level) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.style.fontSize = '100px';
  overlay.style.color = 'white';

  document.querySelector('#game-area').appendChild(overlay);

  let count = 3;

  const interval = setInterval(() => {
    overlay.textContent = count;
    count--;
    if (count < 0) {
      clearInterval(interval);
      overlay.remove();
      // Запуск уровня
      startGame(level);
    }
  }, 1000);
}

// Переходы между раундами
function transitionAnimation(callback) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.style.backgroundColor = 'white';
  overlay.style.opacity = 0;
  overlay.style.transition = 'opacity 0.5s';

  document.querySelector('#game-area').appendChild(overlay);
  // Анимация исчезновения
  setTimeout(() => {
    overlay.style.opacity = 1;
  }, 10);
  setTimeout(() => {
    overlay.remove();
    if (callback) callback();
  }, 500);
}






  
function saveRating() {
  // Получаем имя игрока
  const playerName = localStorage.getItem('playerName') || 'Аноним';

  // Сохраняем результат
  const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
  ratings.push({ name: playerName, score: points });
  localStorage.setItem('ratings', JSON.stringify(ratings));
}

// Сообщение об окончании уровня
function showLevelEnd() {
  let endMessage = document.getElementById('endMessage');
  if (!endMessage) {
    endMessage = document.createElement('div');
    endMessage.id = 'endMessage';
    document.querySelector('#game-area').appendChild(endMessage);
  }
  // Формируем сообщение
  let message = '';
  if (currentLevel < 3) {
    message = `Уровень ${currentLevel} завершен! Набрано очков: ${points}`;
  } else {
    message = `Игра окончена! Набрано очков: ${points}`;
  }

  endMessage.textContent = message;
  endMessage.style.display = 'block';

  setTimeout(() => { endMessage.remove(); }, 3000);
}

// Конец игры
function endGame(win) {
  clearInterval(timerInterval);

  if (currentLevel < 3 && win === 1) {
    showLevelEnd()
    if (currentLevel === 2 && dropArea) {
      dropArea.remove();
    }
    currentLevel++;
    // Запускаем следующий уровень
    setTimeout(() => { showLevelIntro(currentLevel); }, 3000);
  } else {
    // Все уровни пройдены
    currentLevel = 3;
    showLevelEnd()
    // Сохранить результат в рейтинг
    saveRating();
    // Перейти на страницу рейтинга или перезагрузить
    setTimeout(() => { window.location.href = 'rating.html'; }, 3000);
  }
}


function startGame(level) {
  // В зависимости от уровня вызываем нужную инициализацию
  switch(level) {
    case 1:
      initLevel1();
      break;
    case 2:
      initLevel2();
      break;
    case 3:
      initLevel3();
      break;
  }
}


// Обработчики кнопок
document.querySelector('#endLevelBtn').onclick = () => {
  // Удаление старого элемента если он существует
  const element = document.querySelector('.overlay');
  if (element) {
    element.remove();
  }
  // Завершение текущего уровня
  endGame(1);
};

document.querySelector('#endGameBtn').onclick = () => {
  // Завершение игры
  endGame(0);
};

// Вызов в начале уровня
// startGame(currentLevel);

// Перед стартом вызываем окно с правилами и отсчетом
showLevelIntro(currentLevel);

// initLevel1();
// initLevel2();
// initLevel3();
