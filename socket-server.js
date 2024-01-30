function CallLogic(io) {
    ///  sv side logic.
    const connectedClients = {};

    io.on('connection', (socket) => {
        const clientID = socket.id;
        connectedClients[clientID] = socket;

        socket.broadcast.emit('client', { clientID });

        socket.on('offer', (offerData) => {
            const targetSocket = connectedClients[offerData.user];
            if (targetSocket) {
                targetSocket.emit("offer", { offer: offerData.offer, sender: clientID });
            }
        });

        socket.on('answer', (answerData) => {
            const targetSocket = connectedClients[answerData.user];
            if (targetSocket) {
                targetSocket.emit("answer", { answer: answerData.answer, sender: clientID });
            }
        });

        socket.on('join-room', (roomName) => {
            socket.join(roomName);
            io.to(roomName).emit('user-joined', { userID: clientID });

            // Enviar la pista de audio local al nuevo usuario
            const localStream = connectedClients[clientID].localStream;
            if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                socket.emit('new-audio-track', { track: audioTrack, user: clientID });
            }
        });

        socket.on('disconnect', () => {
            delete connectedClients[clientID];
            console.log(`${clientID} disconnected`);
        });
    });

}


module.exports = CallLogic;