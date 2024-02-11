const socket = io();

document.getElementById("roomForm").addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const roomNameInput = document.getElementById("nameInput");
    // Emitir evento 'join-room' al servidor
    socket.emit('join-room', roomNameInput.value);

    // Esperar a que el servidor responda (opcional)
    // Puedes ajustar esto según tus necesidades
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirigir a la URL con el nombre de la sala después de unirse
});


document.getElementById("searchForm").addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const searchTerm = document.getElementById("search").value;
    const nav = document.getElementById("user-search-nav");

    // Realizar una solicitud al servidor para buscar el usuario
    try {
        const response = await fetch(`/searchUser?username=${searchTerm}`);
        const userData = await response.json();

        if (userData) {
            // El usuario fue encontrado, puedes manejar la respuesta como desees
            console.log('User found:', userData);
            nav.innerHTML = `<a>${userData.username}</a>
            <button id="add-user" type="submit">Add User</button>`;

            document.getElementById("add-user").addEventListener("click", async (ev) => {
                console.log(userData.id);
                fetch("/addFriend", {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ user: userData.id })
                })
                    .then(response => response.json()) // Parse the response as JSON
                    .then(data => {
                        console.log(data); // Log the parsed response data
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });


        } else {
            // El usuario no fue encontrado
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error searching for user:', error);
    }
});

// Puedes escuchar eventos adicionales del servidor si es necesario
socket.on('user-joined', (data) => {
    console.log(`User ${data.userID} joined the room`);
    // Redirigir a la URL con el nombre de la sala después de unirse
    window.location.href = `/room/${roomNameInput.value}`;
});
