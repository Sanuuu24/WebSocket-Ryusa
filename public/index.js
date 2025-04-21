const messageBox = document.getElementById('messageBox');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    const socket = new WebSocket('ws://127.0.0.1:3000');
    
    socket.addEventListener('open', (event) => {
      appendMessage('Terhubung ke server');
    });
    

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'notification') {
        appendMessage(`Notifikasi: ${JSON.stringify(data.data)}`);
      } else if (data.type === 'broadcast') {
        appendMessage(`Broadcast: ${JSON.stringify(data.data)}`);
      } else if (data.type === 'connection') {
        appendMessage(`Server: ${data.message}`);
      }
    });

    socket.addEventListener('close', (event) => {
      appendMessage('Terputus dari server');
    });
    

    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      
      if (message) {
        socket.send(JSON.stringify({
          text: message,
          timestamp: new Date().toISOString()
        }));
        
        messageInput.value = '';
      }
    });
    
    messageInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sendButton.click();
      }
    });

    function appendMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      messageBox.appendChild(messageElement);
      messageBox.scrollTop = messageBox.scrollHeight;
    }