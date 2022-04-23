const PORTA = process.env.PORTA || 8080;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const applicazione = express();


articoli = [];
const giornali = [
  {
    name: "repubblica",
    url: "https://www.repubblica.it/esteri/",
  },
  {
    name: "corriere",
    url: "https://www.corriere.it/esteri/",
  },
  {
    name: "stampa",
    url: "https://www.lastampa.it/esteri/"
  }
];

giornali.forEach((giornale) => {
  axios.get(giornale.url).then((response) => {
    const risposta = response.data;
    const $ = cheerio.load(risposta);
    $('a:contains("guerra")', risposta).each(function () {
      const titolo = $(this).text();
      const url = $(this).attr("url");
      articoli.push({
        titolo,
        url,
        source: giornale.name,
      });
    });
  });
});



applicazione.get("/news", (req, res) => {
  res.json(articoli);
});

applicazione.listen(PORTA, () => console.log("Serv list"));
