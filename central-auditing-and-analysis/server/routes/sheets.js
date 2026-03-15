const express = require('express');
const router = express.Router();
const { fetchSheetData } = require('../services/sheetsService');

router.get('/sheets/data', async (req, res) => {
  try {
    const { url, months } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, error: 'Missing url parameter' });
    }

    const monthsArray = months ? months.split(',').filter(Boolean) : [];
    const result = await fetchSheetData(url, monthsArray);

    res.json({ success: true, data: result.data, sheetTitle: result.sheetTitle });
  } catch (error) {
    console.error('Sheets API error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
