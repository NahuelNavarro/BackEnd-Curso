const socket = io();
let user;
let chatBox = document.getElementById('chatBox');
let log = document.getElementById('messageLogs');
let data;

socket.on('message', msg =>{
    data = msg;
});

socket.on('messageLogs', msg =>{
    renderizar(msg);
});

const renderizar = (msg) =>{
    let messages = '';
    msg.forEach(message => {
        const isCurrentUser = message.user === user; // Corregir el operador de comparación
        const messageClass = isCurrentUser ? 'my-message' : 'other-message';
        messages += `<div class="${messageClass}">${message.user}: ${message.message}</div>`;
    });

    log.innerHTML = messages;
    chatBox.scrollIntoView(false);
};

document.addEventListener("DOMContentLoaded", function() {
    const userEmail = prompt("Identifícate\nIngresa tu correo:");
    if (userEmail) {
        user = userEmail;
        // Emitir un evento para solicitar los mensajes antiguos cuando se abre un nuevo chat
        socket.emit('getOldMessages');
    }
});

chatBox.addEventListener('keyup', evt=>{
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            const message = chatBox.value;
            socket.emit('message', {user, message});
            chatBox.value = '';
        }
    }
});

socket.on('nuevo_user',() =>{
    alert('Nuevo usuario conectado');
});

// Escuchar el evento para recibir mensajes antiguos
socket.on('oldMessages', (msg) => {
    renderizar(msg);
});
