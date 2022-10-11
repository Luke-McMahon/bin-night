const puppeteer = require("puppeteer");

(async () => {
  const address = "5 Follett Court, Carrum Downs";
  const councilWebsite =
    "https://frankston.pozi.com/#card=wastecollection&fieldnames=Next%20Rubbish%20Bin%20Collection,Next%20Recycling%20Bin%20Collection,Next%20Green%20Waste%20Bin%20Collection&widget=true&fontsize=12";
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.goto(councilWebsite);
  await page.waitForNetworkIdle();
  await page.click("input");
  await page.keyboard.type(address);
  await page.waitForSelector("li");
  await page.click("li");
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
})();
