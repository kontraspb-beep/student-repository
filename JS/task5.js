let main = document.querySelector(`main`);

class Part {
  constructor (img, angle, x, y) {
    this.img = document.getElementById(`${img}`);
    this.angle = angle;
    this.relativePosition = {x, y};
  }
};
  // Добавляем все части изображения
let body = new Part("img1", 0, 0, 0);
let head = new Part("img2", 0, -66, -39);
let paw1 = new Part("img3", 0, 28, 122);
let paw2 = new Part("img4", 0, -32, 116);
let paw3 = new Part("img5", 0, 267, 84);
let paw4 = new Part("img6", 0, 214, 63);
let tail = new Part("img7", 0, 340, -123);

let tiger = [body, head, paw1, paw2, paw3, paw4, tail];

  // Поворот на 90
function turn (part) {
  part.angle += 90;
  if (part.angle == 360) {
    part.angle = 0;
  }
  part.img.style.transform = `rotate(${part.angle}deg)`;
};

  // Начальные позиции изображений
for (let part of tiger) {
  let randLeft = Math.round(Math.random() * 700);
  let randTop = Math.round(Math.random() * 300);
  let randomAngle = Math.round(Math.random() * 3);
  part.img.style.left = 300 + randLeft + 'px';
  part.img.style.top = 200 + randTop + 'px';
  for (let i = 0; i < randomAngle; i++) {
    turn(part);
  }
}

let isDragging = false;   // для отслеживания перетаскивания
let currentPart = null;  // текущее изображение
let offsetX = 0;    // для расчета смещения курсора по X
let offsetY = 0;    // для расчета смещения курсора по Y
let final = false;

  // Нажатие ЛКМ на изображении
for (let part of tiger) {
  part.img.addEventListener('mousedown', function(e) {
    isDragging = true;
    currentPart = part;
      // Убирает смещение изображения относительно курсора
    offsetX = e.clientX - part.img.offsetLeft;
    offsetY = e.clientY - part.img.offsetTop;
      // предотвращает прилипание к курсору
    e.preventDefault();
  });
}

  // Отпускание ЛКМ
document.addEventListener('mouseup', function() {
  if (isDragging && currentPart) {
    checkCompatibility();
  }
  isDragging = false;
  if (currentPart) {
    currentPart = null;
  }
  if (allPartsUp()) {
    checkFinal();
  }
});

  // Перетаскивание относительно курсора
document.addEventListener('mousemove', function(e) {
  if (isDragging && currentPart) {
    currentPart.img.style.left = (e.clientX - offsetX) + 'px';
    currentPart.img.style.top = (e.clientY - offsetY) + 'px';
  }
});

  // Разворот двойным ЛКМ
for (let part of tiger) {
  part.img.addEventListener('dblclick', function() {
    turn(part);
  });
}

  // Проверка на совместимость частей картинки относительно центральной
function checkCompatibility() {
  // if (currentPart === body) {
  //   return;
  // }
  if (currentPart && body.angle == 0 && currentPart.angle == 0) {
      // Координаты изображений
    let currentX = currentPart.img.offsetLeft;
    let currentY = currentPart.img.offsetTop;
    let bodyX = body.img.offsetLeft;
    let bodyY = body.img.offsetTop;

      // Разница координат с учетом относительного расположения
    let deltaX = (Math.abs(bodyX - (currentX - currentPart.relativePosition.x)));
    let deltaY = (Math.abs(bodyY - (currentY - currentPart.relativePosition.y)));

      // Если близко - сдвигаем на нужное место
    if (deltaX < 30 && deltaY < 30) {
      currentPart.img.style.left = (bodyX + currentPart.relativePosition.x) + 'px';
      currentPart.img.style.top = (bodyY + currentPart.relativePosition.y) + 'px';
    }
  }
};

  // Проверка, что все части развернуты правильно
function allPartsUp() {
  for (let part of tiger) {
    if (part.angle != 0) {
      return false;
    }
  }
  return true;
}

  // Проверка что все элементы на месте
function checkFinal() {
  for (let part of tiger) {
    let currentPositionX = part.img.offsetLeft - part.relativePosition.x;
    let currentPositionY = part.img.offsetTop - part.relativePosition.y;
    let bodyX = body.img.offsetLeft;
    let bodyY = body.img.offsetTop;
      // Сравненеие координат с учетом относительного расположения
    if (currentPositionX != bodyX || currentPositionY != bodyY) {
      return;
    }
  }
  if (!final) {
    final = true;
    playCongratulations();
  }
};

  // Вывод анимации
function playCongratulations() {
  let canvas = document.querySelector('canvas');
  canvas.style.width = '100%';
}
