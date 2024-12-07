const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const roomIdInput = document.getElementById('roomId');
const joinBtn = document.getElementById('joinBtn');
const guessInput = document.getElementById('guessInput');
const messages = document.getElementById('messages');
const timer = document.getElementById('timer');
const welcome = document.getElementById('welcome');
const game = document.getElementById('game');

canvas.width = 800;
canvas.height = 600;

let drawing = false;
let isDrawer = false;
let roomId;

joinBtn.addEventListener('click', () => {
    roomId = roomIdInput.value;
    if (roomId.trim()) {
        socket.emit('joinRoom', roomId);
        welcome.style.display = 'none';
        game.style.display = 'block';
    } else {
        alert("請輸入有效的房間 ID");
    }
});

canvas.addEventListener('mousedown', () => {
    if (isDrawer) drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing || !isDrawer) return;
    const x = event.offsetX;
    const y = event.offsetY;
    ctx.lineTo(x, y);
    ctx.stroke();
    socket.emit('draw', { x, y, roomId });
});

socket.on('draw', ({ x, y }) => {
    ctx.lineTo(x, y);
    ctx.stroke();
});

socket.on('role', (data) => {
    isDrawer = data.role === 'drawer';
    if (isDrawer) {
        alert(`你是畫畫的玩家！你的題目是: ${data.word}`);
    } else {
        alert('你是猜畫的玩家！開始猜測吧！');
    }
});

socket.on('correctGuess', ({ playerId, guess }) => {
    messages.innerText = `玩家 ${playerId} 猜對了: ${guess}`;
});

socket.on('wrongGuess', (guess) => {
    messages.innerText = `錯誤猜測: ${guess}`;
});

socket.on('timer', (timeLeft) => {
    timer.innerText = `剩餘時間: ${timeLeft}s`;
});
