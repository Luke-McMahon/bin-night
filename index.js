const express = require("express");
const app = express();

const crawl = require("./bin-crawl");

app.get("/", function (req, res) {
  res.send("test");
});

app.get("/bins", function (req, res) {
  puppeteer
    .launch({
      args: ["--no-sandbox"],
    })
    .then(async function (browser) {
      const address = "5 Follett Court, Carrum Downs";
      const councilWebsite =
        "https://frankston.pozi.com/#card=wastecollection&fieldnames=Next%20Rubbish%20Bin%20Collection,Next%20Recycling%20Bin%20Collection,Next%20Green%20Waste%20Bin%20Collection&widget=true&fontsize=12";
      const page = await browser.newPage();
      await page.setViewport({
        width: 1200,
        height: 800,
      });
      await page.goto(councilWebsite);
      await page.waitForNetworkIdle();
      const input = await page.$("input");
      await input.evaluate((i) => i.click());
      await page.keyboard.type(address);
      await page.waitForSelector("li", { timeout: 60000 });
      const li = await page.$("li");
      await li.evaluate((l) => l.click());
      await page.waitForSelector(".dataheader");

      const headers = await page.$$eval(".dataheader", (h) =>
        h.map((header) => {
          return header.innerHTML;
        })
      );
      await page.waitForSelector(".datafield");

      const fields = await page.$$eval(".datafield", (d) =>
        d.map((detail) => {
          return detail.innerHTML;
        })
      );

      const bins = {};

      headers.forEach((element, i) => {
        bins[element] = fields[i];
      });

      console.log(bins);
      await browser.close();
      res.send(bins);
    });
});

app.listen(process.env.PORT || 7000, () => {
  console.log(`Running on port ${process.env.PORT || 7000}`);
});
