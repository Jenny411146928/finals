const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 設定靜態檔案路徑
app.use(express.static('public'));

// 遊戲的簡單邏輯
let players = [];

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  
  // 當有玩家連接時，加入 players 陣列
  players.push(socket);

  if (players.length === 2) {
    players[0].emit('turn', '你是畫畫的玩家！');
    players[1].emit('turn', '你是猜畫的玩家！');
  }

  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
    players = players.filter(player => player.id !== socket.id);
  });
});

/*server.listen(3000, () => {
  console.log('Server is running on port 3000');
});*/

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});















