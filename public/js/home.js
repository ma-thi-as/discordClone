


document.getElementById("search-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const username = document.getElementById("input_username").value;
    const response = await fetch(`/searchUser?username=${username}`)
    const { friend } = await response.json();
    document.getElementById("search-result").innerHTML = `
    <div class="friend">
    <p>${friend.username}</p>
    <button id="addFriend">add</button>
    </div>
    `
    document.getElementById("addFriend").addEventListener("click", async (ev) => {
        ev.preventDefault();
        const response = await fetch('/new-friend', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ "friend": friend.id })
        })
        const data = await response.json();
        console.log(data);
    })
    
})

// Define una función que se ejecutará cada 3 segundos para obtener y actualizar la lista de amigos
function updateFriendListPeriodically() {
    setInterval(fetchAndRenderFriendList, 3000); // Cada 3 segundos
}

// Esta función obtiene la lista de amigos del servidor y luego llama a updateFriendList para renderizarla
async function fetchAndRenderFriendList() {
    try {
        const response = await fetch('/my-friends');
        const { friends } = await response.json();
        updateFriendList(friends);
    } catch (error) {
        console.error('Error al obtener la lista de amigos:', error);
    }
}

// Función para actualizar la lista de amigos en el cliente
function updateFriendList(friends) {
    const $friends = document.getElementById("friend-list");
    $friends.innerHTML = ''; // Limpiar la lista antes de actualizar
    if (friends.length <= 0) {
        $friends.innerHTML = `<p>Add friends!</p>`;
    } else {
        friends.forEach( async element => {
            $friends.innerHTML += `<p>${element}</p> 
            <button id="call">Call</button>`;
             document.getElementById("call").addEventListener('click', async (ev) => {
                ev.preventDefault();
                // Emitir evento 'join-room' al servidor
                const roomGeneraton =  async () => {
                    const magic_number2 = Math.random()
                    const magic_number = Math.random()
                    const vocals = ["a","e","i","o","u"]
                    const consonants = ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "Ñ", "P", "Q", "R", "S", "T", "V", "X", "Z", "W" ,"Y"]
                    const nums = [1,2,3,4,5,6,7,8,9,0]
                    let room = "";
                    while (room.length < 6) {
                        console.log(Math.round(magic_number,2));
                        room += "1"
                        
                    }
                    for(let value of room) {
                        console.log(value, magic_number,magic_number2);
                    }
                }
             //   socket.emit('join-room', "test");
                console.log(await roomGeneraton());
            
                // Esperar a que el servidor responda (opcional)
                // Puedes ajustar esto según tus necesidades
                await new Promise(resolve => setTimeout(resolve, 1000));
            
                // Redirigir a la URL con el nombre de la sala después de unirse
            }); 

        });    
    }    
}    

// Llamar a la función para actualizar la lista de amigos cada 3 segundos
updateFriendListPeriodically();


const socket = io();
// Puedes escuchar eventos adicionales del servidor si es necesario
socket.on('user-joined', (data) => {
    console.log(`User ${data.userID} joined the room`);
    // Redirigir a la URL con el nombre de la sala después de unirse
    window.location.href = `/room/test`;
});    
