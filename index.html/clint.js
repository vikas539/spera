const socket = io('http://localhost:4444');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
let clientName;
const append = (message, position) => {
  const iHTML = `<div>${message}</div>`
  const messageElement = document.createElement('div');
  messageElement.innerHTML = iHTML;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);

};

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);


socket.on('user-list', userList => {
  console.log("Current users:", userList);
});

socket.on('user-joined', name => {
  clientName = name
  append(`${name} joined the chat`, 'right');


});


socket.on('leave', name => {
  append(`${name} left the chat`, 'left');
});


socket.on('receive', data => {
  if (socket.id != data.id) {
    append(`${data.name}: ${data.message}`, 'left');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;

  if (message.trim() !== '') {
    append(`You: ${message}`, 'right');
    socket.emit('send', message); 

    messageInput.value = '';
  }
});
