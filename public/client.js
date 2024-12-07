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
    socket.emit('joinRoom', roomId);
    welcome.style.display = 'none';
    game.style.display = 'block';
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
        alert(`You are the drawer! Your word is: ${data.word}`);
    } else {
        alert('You are the guesser! Start guessing!');
    }
});

socket.on('correctGuess', ({ playerId, guess }) => {
    messages.innerText = `Player ${playerId} guessed correctly: ${guess}`;
});

socket.on('wrongGuess', (guess) => {
    messages.innerText = `Wrong guess: ${guess}`;
});

socket.on('timer', (timeLeft) => {
    timer.innerText = `Time left: ${timeLeft}s`;
});
