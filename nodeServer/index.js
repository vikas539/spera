const io = require('socket.io')(4444, {
  cors: {
    origin: '*',
  }
});

const users = {}; 

io.on('connection', socket => {

  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    console.log("New user:", name);
    io.emit('user-list', Object.values(users)); 
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    const name = users[socket.id];
    io.emit('receive', {
      message,
      name,
      id: socket.id
    });
  });

  socket.on('disconnect', () => {
    const name = users[socket.id];
    if (name) {
      delete users[socket.id];
      socket.broadcast.emit('leave', name);
      io.emit('user-list', Object.values(users)); 
    }
  });
});

