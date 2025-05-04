const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { Pool } = require("pg");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve i file statici dalla cartella 'public'
app.use(express.static("public"));

// Connessione a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Inizializza il database (una sola volta all'avvio)
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Database inizializzato con successo");
  } catch (error) {
    console.error("Errore nell'inizializzazione del database:", error);
  }
}

initDB();

// Salva un messaggio nel database e restituisce il timestamp
async function salvaMessaggio(content) {
  try {
    console.log("Salvando messaggio nel DB:", content);
    const res = await pool.query(
      "INSERT INTO messages (content) VALUES ($1) RETURNING timestamp",
      [content]
    );
    console.log("Messaggio salvato, timestamp:", res.rows[0].timestamp);
    return res.rows[0].timestamp;
  } catch (error) {
    console.error("Errore nel salvare il messaggio:", error);
    return new Date();
  }
}

// Invia i messaggi esistenti a un nuovo client
async function inviaMessaggiStorici(ws) {
  try {
    // Prendi i 50 messaggi più RECENTI, ma li invia in ordine CRONOLOGICO
    const res = await pool.query(
      "SELECT content, timestamp FROM messages ORDER BY timestamp DESC LIMIT 50"
    );
    console.log(`Inviando ${res.rows.length} messaggi storici al nuovo client`);
    
    // Inverti l'array per inviare i messaggi in ordine cronologico (dal più vecchio al più recente)
    const messaggiOrdinati = res.rows.reverse();
    
    messaggiOrdinati.forEach((row) => {
      const msg = {
        content: row.content,
        timestamp: row.timestamp,
      };
      ws.send(JSON.stringify(msg));
    });
  } catch (error) {
    console.error("Errore nel recuperare i messaggi storici:", error);
  }
}

// Gestione connessione WebSocket
wss.on("connection", (ws) => {
  console.log("Nuovo client connesso");
  
  // Invia messaggi precedenti al nuovo client
  inviaMessaggiStorici(ws);
  
  // Gestione nuovi messaggi
  ws.on("message", async (message) => {
    let content;
    let timestamp;
    
    try {
      // Tenta di analizzare il messaggio come JSON
      const messageData = JSON.parse(message.toString());
      console.log("Messaggio ricevuto come JSON:", messageData);
      
      // Estrai il contenuto del messaggio
      content = messageData.content;
    } catch (error) {
      // Se il messaggio non è in formato JSON, gestiscilo come testo semplice
      content = message.toString();
      console.log("Messaggio ricevuto come testo:", content);
    }
    
    // Salva nel database e ottieni il timestamp effettivo (indipendentemente dal formato originale)
    timestamp = await salvaMessaggio(content);
    
    // Prepara il payload di risposta
    const payload = {
      content: content,
      timestamp: timestamp,
    };
    
    // Invia a tutti i client connessi
    const jsonPayload = JSON.stringify(payload);
    console.log("Inviando a tutti i client:", jsonPayload);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(jsonPayload);
      }
    });
  });
  
  ws.on("close", () => {
    console.log("Client disconnesso");
  });
  
  // Gestione errori di connessione
  ws.on("error", (error) => {
    console.error("Errore WebSocket:", error);
  });
});

// Aggiunta di un endpoint per verificare lo stato del database
app.get("/api/messages", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT * FROM messages ORDER BY timestamp DESC LIMIT 10");
    res.json(dbRes.rows);
  } catch (err) {
    console.error("Errore nella query API:", err);
    res.status(500).json({ error: "Errore database" });
  }
});

// Avvio del server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
