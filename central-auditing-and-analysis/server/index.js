const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sheetsRoutes = require('./routes/sheets');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());
app.use('/api', sheetsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
