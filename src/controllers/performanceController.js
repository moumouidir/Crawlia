const axios = require('axios');
const cheerio = require('cheerio');

const testPerformance = async (req, res) => {
  const { url } = req.body;

  try {
    const start = Date.now();
    const response = await axios.get(url); 
    const ttfb = Date.now() - start; 
    const $ = cheerio.load(response.data); 
    const seoAttributes = {
      metaDescription: $('meta[name="description"]').attr('content') || 'No meta description', 
      h1: $('h1').length, 
      h2: $('h2').length, 
      imagesWithoutAlt: $('img:not([alt])').length, 
    };

    const deadLinks = [];
    const links = $('a[href]');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      try {
        await axios.get($(link).attr('href')); 
      } catch (error) {
        if (error.response && error.response.status === 404) {
          deadLinks.push($(link).attr('href')); 
        }
      }
    }

   
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../src/assets/style.css">
        <title>Rapport de Performance</title>
      </head>
      <body>
        <div class="rapport">
        <h1>Rapport de Performance</h1>
        <p><strong>Temps jusqu'au premier octet (TTFB) :</strong> ${ttfb} ms</p>
        <h2>Attributs SEO</h2>
        <p><strong>Méta Description :</strong> ${seoAttributes.metaDescription}</p>
        <p><strong>Nombre de balises H1 :</strong> ${seoAttributes.h1}</p>
        <p><strong>Nombre de balises H2 :</strong> ${seoAttributes.h2}</p>
        <p><strong>Images sans texte alternatif :</strong> ${seoAttributes.imagesWithoutAlt}</p>
        <h2>Liens Morts</h2>
        <ul>
          ${deadLinks.map(link => `<li>${link}</li>`).join('')}
        </ul>
        </div>
      </body>
      </html>
    `;

    res.send(html); 
  } catch (error) {
    res.status(500).send('Erreur de récupération de l’URl.'); 
  }
};

module.exports = { testPerformance };
