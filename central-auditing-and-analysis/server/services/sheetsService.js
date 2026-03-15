const { google } = require('googleapis');

function parseSheetUrl(url) {
  const spreadsheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = url.match(/gid=(\d+)/);

  if (!spreadsheetIdMatch) {
    throw new Error('Could not parse spreadsheet ID from URL');
  }

  return {
    spreadsheetId: spreadsheetIdMatch[1],
    gid: gidMatch ? gidMatch[1] : '0',
  };
}

function getAuth() {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!base64Key || base64Key === '<base64 encoded service account JSON>') {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
  }

  const credentials = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf-8'));

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

async function getSheetNameByGid(sheets, spreadsheetId, gid) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets.find(
    (s) => String(s.properties.sheetId) === String(gid)
  );
  return sheet ? sheet.properties.title : null;
}

async function fetchSheetData(url, months) {
  const { spreadsheetId, gid } = parseSheetUrl(url);
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const sheetName = await getSheetNameByGid(sheets, spreadsheetId, gid);
  if (!sheetName) {
    throw new Error(`Sheet tab with gid=${gid} not found`);
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return { data: [], sheetTitle: sheetName };
  }

  const headers = rows[0];
  let data = rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });

  if (months && months.length > 0) {
    const monthsLower = months.map((m) => m.toLowerCase().trim());
    data = data.filter((row) => {
      const rowMonth = (row['Month'] || '').toLowerCase().trim();
      return monthsLower.some((m) => rowMonth.includes(m) || m.includes(rowMonth));
    });
  }

  return { data, sheetTitle: sheetName };
}

module.exports = { fetchSheetData };
