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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
initDB();

// Salva un messaggio nel database
async function salvaMessaggio(content) {
  await pool.query("INSERT INTO messages (content) VALUES ($1)", [content]);
}

// Invia i messaggi esistenti a un nuovo client
async function inviaMessaggiStorici(ws) {
  const res = await pool.query("SELECT content FROM messages ORDER BY id ASC LIMIT 50");
  res.rows.forEach((row) => {
    ws.send(`[STORICO] ${row.content}`);
  });
}

// Gestione connessione WebSocket
wss.on("connection", (ws) => {
  console.log("Nuovo client connesso");

  // Invia messaggi precedenti al nuovo client
  inviaMessaggiStorici(ws);

  // Gestione nuovi messaggi
  ws.on("message", async (message) => {
    const text = message.toString();
    console.log("Messaggio:", text);

    await salvaMessaggio(text);

    // Invia il messaggio a tutti i client connessi
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnesso");
  });
});

// Avvio del server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
