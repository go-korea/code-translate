require('dotenv').config();
const fs = require('fs');
const { parse } = require('node-html-parser');
const { Translate } = require('@google-cloud/translate').v2;

// Your Google Cloud Platform project ID
const projectId = 'hanquoc';
const apiKey = process.env.API_KEY;
const translate = new Translate({ projectId, key: apiKey });

const targetLanguage = "en";

// Read HTML from a file
const html = fs.readFileSync('insurance-landing-vi.html', 'utf-8');

const root = parse(html, {
  comment: true,
  blockTextElements: {
    script: true,
    noscript: true,
    style: true,
    pre: true
  }
});

async function iterate(node) {
  if (node.nodeType === 3) { // Text node
    const text = node.rawText.trim();
    if (text) {
      // Translate the text to English
      node.rawText = await translate.translate(text, {
        to: targetLanguage
      });
      console.log(node.rawText);
    }
  } else {
    node.childNodes.forEach(iterate);
  }
}

iterate(root);

// Write the translated HTML to a new file
fs.writeFileSync('insurance-landing-' + targetLanguage + '.html', root.toString());
