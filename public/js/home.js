const socket = io();
const roomNameInput = document.getElementById("nameInput");

document.getElementById("roomForm").addEventListener('submit', async (ev) => {
    ev.preventDefault();


    // Emitir evento 'join-room' al servidor
    socket.emit('join-room', roomNameInput.value);

    // Esperar a que el servidor responda (opcional)
    // Puedes ajustar esto según tus necesidades
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirigir a la URL con el nombre de la sala después de unirse
});

// Puedes escuchar eventos adicionales del servidor si es necesario
// Puedes escuchar eventos adicionales del servidor si es necesario
socket.on('user-joined', (data) => {
    console.log(`User ${data.userID} joined the room`);
    // Redirigir a la URL con el nombre de la sala después de unirse
    window.location.href = `/room/${roomNameInput.value}`;
});
