const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');


// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// join chatroom
socket.emit('joinRoom', { username, room });


// get room users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});


console.log('username: ' + username
  + ' room: ' + room);
// server message
socket.on('message', message => {
  console.log(message)
  outputMessage(message)

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// event listener for form submit
chatForm.addEventListener('submit', e => {
  e.preventDefault(); // stops from submitting file like all forms do

  // get message text
  const msg = e.target.elements.msg.value;

  // emitting a message to server
  socket.emit('chatMessage', msg);

  // clear chat input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
  // scroll down

}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to userlist
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
