// 获取画布和上下文  
const canvas = document.getElementById("gameCanvas");  
const ctx = canvas.getContext("2d");  

// 设置画布大小  
canvas.width = 640;  
canvas.height = 480;  

// 定义球和砖块的属性  
const ballRadius = 10;  
let x = canvas.width / 2;  
let y = canvas.height - 30;  
let dx = 2;  
let dy = -2;  

const paddleHeight = 10;  
const paddleWidth = 75;  
let paddleX = (canvas.width - paddleWidth) / 2;  

// 砖块设置  
const brickRowCount = 5;  
const brickColumnCount = 3;  
const brickWidth = 75;  
const brickHeight = 20;  
const brickPadding = 10;  
const brickOffsetTop = 30;  
const brickOffsetLeft = 30;  

let bricks = [];  
const brickColors = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C", "#FF33A6"]; // 定义不同颜色的砖块  
for (let c = 0; c < brickColumnCount; c++) {  
    bricks[c] = [];  
    for (let r = 0; r < brickRowCount; r++) {  
        bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[r % brickColors.length] }; // 根据行选择颜色  
    }  
}  

let score = 0;  
let isRightPressed = false;  
let isLeftPressed = false;  

// 处理键盘事件  
document.addEventListener("keydown", keyDownHandler);  
document.addEventListener("keyup", keyUpHandler);  

function keyDownHandler(e) {  
    if (e.key === "Right" || e.key === "ArrowRight") {  
        isRightPressed = true;  
    } else if (e.key === "Left" || e.key === "ArrowLeft") {  
        isLeftPressed = true;  
    }  
}  

function keyUpHandler(e) {  
    if (e.key === "Right" || e.key === "ArrowRight") {  
        isRightPressed = false;  
    } else if (e.key === "Left" || e.key === "ArrowLeft") {  
        isLeftPressed = false;  
    }  
}  

// 碰撞检测  
function collisionDetection() {  
    for (let c = 0; c < brickColumnCount; c++) {  
        for (let r = 0; r < brickRowCount; r++) {  
            const b = bricks[c][r];  
            if (b.status === 1) {  
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {  
                    dy = -dy;  
                    b.status = 0;  
                    score++;  
                    if (score === brickRowCount * brickColumnCount) {  
                        alert("恭喜你，获胜了！");  
                        document.location.reload();  
                    }  
                }  
            }  
        }  
    }  
}  

// 绘制球、挡板和砖块  
function drawBall() {  
    ctx.beginPath();  
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);  
    ctx.fillStyle = "#0095DD";  
    ctx.fill();  
    ctx.closePath();  
}  

function drawPaddle() {  
    ctx.beginPath();  
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);  
    ctx.fillStyle = "#0095DD";  
    ctx.fill();  
    ctx.closePath();  
}  

function drawBricks() {  
    for (let c = 0; c < brickColumnCount; c++) {  
        for (let r = 0; r < brickRowCount; r++) {  
            const b = bricks[c][r];  
            if (b.status === 1) {  
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;  
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;  
                b.x = brickX;  
                b.y = brickY;  
                ctx.beginPath();  
                ctx.rect(brickX, brickY, brickWidth, brickHeight);  
                ctx.fillStyle = b.color; // 使用砖块的颜色  
                ctx.fill();  
                ctx.closePath();  
            }  
        }  
    }  
}  

function drawScore() {  
    ctx.font = "16px Arial";  
    ctx.fillStyle = "#0095DD";  
    ctx.fillText("分数: " + score, 8, 20);  
}  

// 主要绘制函数  
function draw() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    drawBricks();  
    drawBall();  
    drawPaddle();  
    drawScore();  
    collisionDetection();  

    // 小球移动  
    x += dx;  
    y += dy;  

    // 碰撞检测边界  
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {  
        dx = -dx;  
    }  
    if (y + dy < ballRadius) {  
        dy = -dy;  
    } else if (y + dy > canvas.height - ballRadius) {  
        if (x > paddleX && x < paddleX + paddleWidth) {  
            dy = -dy;  
        } else {  
            alert("游戏结束！");  
            document.location.reload();  
        }  
    }  

    // 控制挡板移动  
    if (isRightPressed && paddleX < canvas.width - paddleWidth) {  
        paddleX += 7;  
    } else if (isLeftPressed && paddleX > 0) {  
        paddleX -= 7;  
    }  

    requestAnimationFrame(draw);  
}  

// 启动游戏  
draw();