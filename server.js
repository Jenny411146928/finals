const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let rooms = {}; // 儲存房間的狀態
let fruitWords = ['apple', 'banana', 'cherry', 'grape', 'orange', 'pear', 'peach', 'pineapple', 'strawberry', 'watermelon'];

app.use(express.static('public')); // 提供靜態檔案

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // 玩家加入房間
    socket.on('joinRoom', (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { players: [], currentWord: '', drawer: null };
        }
        const room = rooms[roomId];
        room.players.push(socket.id);

        socket.join(roomId);
        io.to(roomId).emit('message', `Player ${socket.id} joined the room!`);

        if (room.players.length === 2) {
            startGame(roomId);
        }
    });

    // 接收繪圖數據並廣播給其他玩家
    socket.on('draw', (data) => {
        const roomId = data.roomId;
        socket.to(roomId).emit('draw', data);
    });

    // 接收猜測並檢查答案
    socket.on('guess', (data) => {
        const { roomId, guess } = data;
        const room = rooms[roomId];

        if (guess.toLowerCase() === room.currentWord) {
            io.to(roomId).emit('correctGuess', { playerId: socket.id, guess });
            switchRoles(roomId);
        } else {
            socket.emit('wrongGuess', guess);
        }
    });

    // 處理玩家斷線
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const roomId in rooms) {
            const room = rooms[roomId];
            room.players = room.players.filter((player) => player !== socket.id);
            if (room.players.length === 0) delete rooms[roomId];
        }
    });
});

// 開始遊戲，選擇題目和角色
function startGame(roomId) {
    const room = rooms[roomId];
    room.currentWord = fruitWords[Math.floor(Math.random() * fruitWords.length)];
    room.drawer = room.players[0]; // 第一位玩家為繪畫者
    io.to(room.drawer).emit('role', { role: 'drawer', word: room.currentWord });
    io.to(room.players[1]).emit('role', { role: 'guesser' });

    io.to(roomId).emit('message', `Game started! ${room.drawer} is drawing.`);
}

// 交換角色
function switchRoles(roomId) {
    const room = rooms[roomId];
    room.players.reverse(); // 交換玩家順序
    startGame(roomId);
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
