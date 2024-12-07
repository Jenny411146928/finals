const socket = io();
let isDrawer = false;

// 畫布設定
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// 畫布大小
canvas.width = 800;
canvas.height = 600;

// 畫畫事件處理
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
  if (!isDrawer) return;
  drawing = true;
  draw(e); // 確保點擊的第一點也畫出來
}

function draw(e) {
  if (!drawing || !isDrawer) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  // 傳送畫圖數據到伺服器
  socket.emit('draw', { x, y });
}

function stopDrawing() {
  if (!isDrawer) return;
