const socket = io();
const constraints = { audio: true };
const configuration = {
    'iceServers': [
        {
            urls: "stun:stun.stunprotocol.org",
        },
        {
            urls: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
        },
        // Otros servidores según sea necesario
    ]
}
var peerConnection = new RTCPeerConnection(configuration);
const remoteAudio = document.querySelector("#remoteAudio")

const initLocalStream = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);

        });
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }

};

initLocalStream();

let myClientID;
socket.on('client', async (socketData) => {
    // Puedes realizar otras operaciones específicas para myClient aquí
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    myClientID = socketData.clientID;
    socket.emit('offer', { "offer": offer, "user": socketData.clientID });

    // Inside the icecandidate event listener
    peerConnection.addEventListener('icecandidate', evnt => {
        console.log(peerConnection.candidate);
        if (evnt.candidate) {
            socket.emit('ice-candidate', { 'candidate': evnt.candidate, 'user': socketData.clientID })
        }
    });

});


// Inside the 'offer' event handler
socket.on('offer', async (socketData) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(socketData.offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('answer', { 'answer': answer, 'user': socketData.sender });
});

// Inside the 'answer' event handler
socket.on('answer', async (socketData) => {
    console.log('Answer received:', socketData);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(socketData.answer));
});

peerConnection.addEventListener('icegatheringstatechange', (event) => {
    console.log("ICE Gathering State: " + peerConnection.iceGatheringState);
});


socket.on('ice-candidate', (socketData) => {
    console.log("Candidaeet scoket: " + socketData);
});

peerConnection.addEventListener('track', async (event) => {
    console.log(event);
    const [remoteStream] = event.streams;
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play()

});
function endCall() {
    console.log("Call ended");
}
