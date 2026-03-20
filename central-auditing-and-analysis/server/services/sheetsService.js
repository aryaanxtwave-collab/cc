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

function hasServiceAccountKey() {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  return base64Key && base64Key !== '<base64 encoded service account JSON>' && base64Key.length > 10;
}

function getAuth() {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!hasServiceAccountKey()) {
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

/**
 * Fetch data from a public Google Sheet using the Visualization API (no auth needed).
 * Works for sheets shared as "Anyone with the link can view".
 */
async function fetchPublicSheetData(url, months) {
  const { spreadsheetId, gid } = parseSheetUrl(url);

  const vizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

  const response = await fetch(vizUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch public sheet (HTTP ${response.status}). Ensure the sheet is shared as "Anyone with the link".`);
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);

  if (!rows || rows.length === 0) {
    return { data: [], sheetTitle: `Sheet (gid=${gid})` };
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

  return { data, sheetTitle: `Sheet (gid=${gid})` };
}

/**
 * Parse CSV text into a 2D array. Handles quoted fields with commas and newlines.
 */
function parseCSV(text) {
  const rows = [];
  let current = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        current.push(field);
        field = '';
      } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        current.push(field);
        field = '';
        if (current.some((c) => c.trim() !== '')) {
          rows.push(current);
        }
        current = [];
        if (ch === '\r') i++; // skip \n after \r
      } else {
        field += ch;
      }
    }
  }

  // Last field/row
  if (field || current.length > 0) {
    current.push(field);
    if (current.some((c) => c.trim() !== '')) {
      rows.push(current);
    }
  }

  return rows;
}

/**
 * Fetch sheet data using Google Sheets API with service account authentication.
 */
async function fetchAuthenticatedSheetData(url, months) {
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

/**
 * Main entry point: tries service account auth first, falls back to public access.
 */
async function fetchSheetData(url, months) {
  if (hasServiceAccountKey()) {
    try {
      return await fetchAuthenticatedSheetData(url, months);
    } catch (err) {
      console.warn('Service account fetch failed, trying public access:', err.message);
    }
  }

  return await fetchPublicSheetData(url, months);
}

module.exports = { fetchSheetData };
