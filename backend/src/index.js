const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend', version: process.env.APP_VERSION || 'dev' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`);
});
