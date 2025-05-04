<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Chat WebSocket</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    #messages {
      border: 1px solid #ccc;
      height: 300px;
      overflow-y: scroll;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f9f9f9;
    }
    .message {
      margin-bottom: 8px;
      padding: 5px;
      border-radius: 4px;
      background-color: #fff;
    }
    .timestamp {
      color: gray;
      font-size: 0.85em;
      margin-right: 5px;
    }
    .input-container {
      display: flex;
      margin-top: 10px;
    }
    #input {
      flex-grow: 1;
      padding: 8px;
      margin-right: 5px;
    }
    button {
      padding: 8px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
    .status {
      margin-top: 5px;
      font-style: italic;
    }
    .connection-status {
      text-align: right;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <h1>Chat WebSocket</h1>
  <div class="connection-status" id="connection-status">Connessione...</div>
  <div id="messages"></div>
  <div class="input-container">
    <input id="input" type="text" placeholder="Scrivi un messaggio..." autofocus />
    <button onclick="sendMessage()">Invia</button>
  </div>
  <div class="status" id="status"></div>
  
  <script>
  const messages = document.getElementById("messages");
  const input = document.getElementById("input");
  const statusDiv = document.getElementById("status");
  const connectionStatus = document.getElementById("connection-status");
  
  // Funzione per aggiornare lo stato
  function updateStatus(text, isError = false) {
    statusDiv.textContent = text;
    statusDiv.style.color = isError ? "red" : "green";
    setTimeout(() => {
      statusDiv.textContent = "";
    }, 3000);
  }
  
  // Inizializza la connessione WebSocket
  function initWebSocket() {
    const socket = new WebSocket("wss://" + window.location.host);
    
    // Funzione per inviare messaggi
    window.sendMessage = function() {
      if (input.value.trim()) {
        try {
          // Creare l'oggetto messaggio nel formato corretto
          const messageObj = {
            content: input.value,
            timestamp: new Date().toISOString()
          };
          
          // Debug: mostra cosa stiamo inviando
          console.log("Invio messaggio:", JSON.stringify(messageObj));
          
          // Inviare come stringa JSON
          socket.send(JSON.stringify(messageObj));
          
          // Aggiornare stato
          updateStatus("Messaggio inviato");
          
          // Pulire l'input dopo l'invio
          input.value = "";
        } catch (err) {
          console.error("Errore nell'invio del messaggio:", err);
          updateStatus("Errore nell'invio del messaggio", true);
        }
      }
    }
    
    // Gestione dei messaggi in arrivo
    socket.onmessage = (event) => {
      console.log("Messaggio ricevuto:", event.data);
      try {
        const data = JSON.parse(event.data);
        const content = data.content;
        const timestamp = new Date(data.timestamp);
        const timeStr = timestamp.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        
        // Creare elemento messaggio
        const msg = document.createElement("div");
        msg.className = "message";
        
        // Aggiungere timestamp e contenuto
        const timeSpan = document.createElement("span");
        timeSpan.className = "timestamp";
        timeSpan.textContent = `[${timeStr}] `;
        
        msg.appendChild(timeSpan);
        msg.appendChild(document.createTextNode(content));
        
        // Aggiungere al contenitore messaggi e scorrere in basso
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
      } catch (err) {
        console.error("Errore nel parsing del messaggio:", err, event.data);
        updateStatus("Errore nella ricezione del messaggio", true);
      }
    };
    
    // Gestire invio con tasto Enter
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
    
    // Gestione degli eventi di connessione
    socket.onopen = () => {
      const statusMsg = document.createElement("div");
      statusMsg.textContent = "Connesso al server";
      statusMsg.style.color = "green";
      statusMsg.className = "status";
      messages.appendChild(statusMsg);
      connectionStatus.textContent = "Connesso";
      connectionStatus.style.color = "green";
    };
    
    socket.onerror = (error) => {
      const statusMsg = document.createElement("div");
      statusMsg.textContent = "Errore di connessione";
      statusMsg.style.color = "red";
      statusMsg.className = "status";
      messages.appendChild(statusMsg);
      connectionStatus.textContent = "Errore";
      connectionStatus.style.color = "red";
      console.error("Errore WebSocket:", error);
    };
    
    socket.onclose = (event) => {
      const statusMsg = document.createElement("div");
      statusMsg.textContent = `Disconnesso dal server (Codice: ${event.code})`;
      statusMsg.style.color = "orange";
      statusMsg.className = "status";
      messages.appendChild(statusMsg);
      connectionStatus.textContent = "Disconnesso";
      connectionStatus.style.color = "orange";
      
      // Riprova a connettersi dopo 5 secondi
      setTimeout(() => {
        connectionStatus.textContent = "Riconnessione...";
        connectionStatus.style.color = "blue";
        initWebSocket();
      }, 5000);
    };
    
    return socket;
  }
  
  // Inizializza la connessione
  initWebSocket();
  </script>
</body>
</html>
