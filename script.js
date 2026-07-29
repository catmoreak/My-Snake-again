
new Image().src = "/public/snake-head3.png";
new Image().src = "/public/snake-fruit2.png";

let cont = document.querySelector(".container");
let xlen = parseInt(cont.offsetWidth / 30),
    ylen = parseInt(cont.offsetHeight / 30);
let score = 0;
let boxes = [];
let places = [];
let scoreAt = [parseInt(Math.random() * xlen), parseInt(Math.random() * ylen)];
let dir = "r";
let movedOnce = false;
let gameOver = false;
let keyMap = {
    ArrowUp: "u",
    w: "u",
    W: "u",
    ArrowDown: "d",
    s: "d",
    S: "d",
    ArrowLeft: "l",
    a: "l",
    A: "l",
    ArrowRight: "r",
    d: "r",
    D: "r",
};

for (let i = 0; i < ylen; i++) {
    places[i] = [];
    for (let j = 0; j < xlen; j++) {
        let el = document.createElement("div");
        places[i].push(el);
        el.classList.add("box");
        cont.appendChild(el);
    }
}

class Box {
    constructor(x, y, color = "red") {
        this.x = x;
        this.y = y;
        this.color = color;
        places[y][x].style.backgroundColor = color;
    }

    move(dir, shouldClean = false) {
        places[this.y][this.x].style.rotate = "0deg";
        if (shouldClean) this.clean();
        if (dir == "l") {
            this.x = this.x > 0 ? this.x - 1 : xlen - 1;
        } else if (dir == "r") {
            this.x = this.x + 1 <= xlen - 1 ? this.x + 1 : 0;
        } else if (dir == "u") {
            this.y = this.y > 0 ? this.y - 1 : ylen - 1;
        } else if (dir == "d") {
            this.y = this.y < ylen - 1 ? this.y + 1 : 0;
        }
        places[this.y][this.x].style.background = this.color;
    }

    moveTo(x, y, shouldClean = false) {
        if (shouldClean) this.clean();
        this.x = x;
        this.y = y;
        places[y][x].style.background = this.color;
    }

    clean() {
        places[this.y][this.x].style.background = "transparent";
    }
}

let scoreBox = new Box(
    ...scoreAt,
    "url('/public/snake-fruit2.png') transparent"
);

function move(dir) {
    if (boxes.length > 1)
        boxes[boxes.length - 1].moveTo(
            boxes[boxes.length - 2].x,
            boxes[boxes.length - 2].y,
            true
        );
    for (let i = boxes.length - 2; i > 0; i--)
        boxes[i].moveTo(boxes[i - 1].x, boxes[i - 1].y);
    boxes[0].move(dir);
}

function keydown(e) {
    let newDir = keyMap[e.key];
    if (!newDir) return;
    e.preventDefault();
    if (
        (newDir == "u" && dir == "d") ||
        (newDir == "d" && dir == "u") ||
        (newDir == "l" && dir == "r") ||
        (newDir == "r" && dir == "l") ||
        (newDir == "u" && dir == "u") ||
        (newDir == "d" && dir == "d") ||
        (newDir == "l" && dir == "l") ||
        (newDir == "r" && dir == "r")
    )
        return;
    if (!movedOnce)
        return setTimeout(() => {
            dir = newDir;
        }, 100);
    dir = newDir;
    movedOnce = false;
    setTimeout(() => {
        movedOnce = true;
    }, 100);
}

function collisionCheck() {
    for (let i = 1; i < boxes.length; i++) {
        if (boxes[0].x === boxes[i].x && boxes[0].y === boxes[i].y) {
            gameOver = true;
            crashEffect();
            break;
        }
    }
}

function crashEffect() {
    let headEl = places[boxes[0].y][boxes[0].x];
    cont.classList.add("shaking");
    setTimeout(() => cont.classList.remove("shaking"), 500);
    let cx = headEl.offsetLeft + headEl.offsetWidth / 2;
    let cy = headEl.offsetTop + headEl.offsetHeight / 2;
    
    let puffCount = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < puffCount; i++) {
        let puff = document.createElement("div");
        puff.classList.add("smoke");
        let size = 12 + Math.random() * 16;
        puff.style.width = size + "px";
        puff.style.height = size * (0.85 + Math.random() * 0.3) + "px";
        puff.style.left = cx - size / 2 + (Math.random() * 14 - 7) + "px";
        puff.style.top = cy - size / 2 + (Math.random() * 10 - 5) + "px";
        puff.style.setProperty("--dx", Math.random() * 80 - 40 + "px");
        puff.style.setProperty("--dy", -18 - Math.random() * 65 + "px");
        puff.style.setProperty("--grow", 1.8 + Math.random() * 1.4);
        puff.style.setProperty("--spin", Math.random() * 120 - 60 + "deg");
        puff.style.animationDuration = 0.8 + Math.random() * 0.7 + "s";
        puff.style.animationDelay = Math.random() * 0.35 + "s";
        puff.style.filter = "blur(" + (Math.random() * 1.5).toFixed(1) + "px)";
        cont.appendChild(puff);
        setTimeout(() => puff.remove(), 2200);
    }

    ["💫", "✨", "💫"].forEach((star, i) => {
        let el = document.createElement("div");
        el.classList.add("dizzy-star");
        el.innerText = star;
        el.style.left = cx - 8 + (i - 1) * 12 + "px";
        el.style.top = cy - 22 + "px";
        el.style.setProperty("--dx", (i - 1) * 22 + (Math.random() * 8 - 4) + "px");
        el.style.animationDelay = i * 0.15 + "s";
        cont.appendChild(el);
        setTimeout(() => el.remove(), 1800);
    });
    setTimeout(() => {
        renderDigits(document.querySelector(".final-score"), score);

        document.querySelector(".gameOver").style.display = "grid";
    }, 1400);
}


function add(x, y, color = "red") {
    boxes.push(new Box(x, y, color));
}

function start(e) {
    let ndir = keyMap[e.key];
    if (!ndir) return;
    dir = ndir;
    e.preventDefault();
    let i = 0;
    add(
        0,
        0,
        "url('/public/snake-head3.png') transparent"
    );
    let int = setInterval(() => {
        add(0, 0, "#5b7af9");
        move(dir);
        i++;
        if (i >= 1) {
            clearInterval(int);
            requestAnimationFrame(animate);
        }
    }, 100);
    window.removeEventListener("keydown", start);
    window.addEventListener("keydown", keydown);
}

function animate() {
    if (gameOver) return;
    move(dir);
    collisionCheck();
    checkPoint();
    places[boxes[0].y][boxes[0].x].style.rotate =
        dir == "d"
            ? "0deg"
            : dir == "u"
            ? "180deg"
            : dir == "r"
            ? "-90deg"
            : "90deg";
    setTimeout(() => requestAnimationFrame(animate), 100);
}

function isCellFree(x, y) {
    return boxes.every((b) => b.x !== x || b.y !== y);
}


function renderDigits(el, n) {
    let digits = String(n).split("");
    if (el.children.length !== digits.length) {
        el.innerHTML = "";
        digits.forEach(() => {
            let d = document.createElement("span");
            d.className = "digit";
            el.appendChild(d);
        });
    }
    digits.forEach((ch, i) => {
        let card = el.children[i];
        if (card.innerText !== ch) {
            card.innerText = ch;
            card.classList.remove("tick");
            void card.offsetWidth; 
            card.classList.add("tick");
        }
    });
}

function checkPoint() {
    if (boxes[0].x === scoreBox.x && boxes[0].y === scoreBox.y) {
        score++;
        renderDigits(document.querySelector(".score"), score);
        let point = [
                parseInt(Math.random() * xlen),
                parseInt(Math.random() * ylen),
            ],
            tries = 7;
        while (
            tries > 0 &&
            !isCellFree(point[0], point[1])
        ) {
            tries--;
            point = [
                parseInt(Math.random() * xlen),
                parseInt(Math.random() * ylen),
            ];
        }
        scoreAt = point;
        scoreBox.moveTo(...point);
        let lastBox = boxes[boxes.length - 1];
        boxes.push(new Box(lastBox.x, lastBox.y, "#5b7af9"));
    }
}
function restart() {
    gameOver = false;
    score = 0;
    document.querySelectorAll(".smoke, .dizzy-star").forEach((s) => s.remove());
    boxes.forEach((b) => b.clean());
    boxes = [];
    scoreAt = [parseInt(Math.random() * xlen), parseInt(Math.random() * ylen)];
    scoreBox.moveTo(scoreAt[0], scoreAt[1], true);
    document.querySelector(".gameOver").style.display = "none";
    renderDigits(document.querySelector(".score"), 0);
    movedOnce = true;
    window.removeEventListener("keydown", keydown);
    window.addEventListener("keydown", start);
}

restart();