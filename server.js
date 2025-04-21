const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;
const hostName = "127.0.0.1";

const studentController = require('./controllers/studentController');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  
  console.log('Klien terhubung');
  
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Terhubung ke server WebSocket'
  }));
  
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Diterima:', parsedMessage);
      
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'broadcast',
            data: parsedMessage
          }));
        }
      });
    } catch (error) {
      console.error('Error parsing pesan:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Klien terputus');
  });
});

app.get('/', (req, res) => {
  res.send({
    message: 'Halaman Utama'
  });
});

app.get('/student', studentController.getAllStudents);
app.post('/student', studentController.createStudent);
app.delete('/student/:id', studentController.deleteStudent);
app.get('/student/:id', studentController.getStudentById);
app.put('/student/:id', studentController.updateStudent);


app.post('/send-notification', (req, res) => {
  const notification = req.body;
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  });
  
  res.status(200).json({ message: 'Notifikasi berhasil dikirim' });
});

server.listen(port, () => console.log(`Server berjalan di http://${hostName}:${port}`));