const puppeteer = require('puppeteer');

describe('Addition', () => {
  it('knows that 2 and 2 make 4', () => {
    const expected = 4;
    const actual = 2 + 2;

    expect(actual).toBe(expected);
  });
});

//Write a test for launching the browser:
describe('puppeteer', () => {
  let page, browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
  });

  it('can extract text from header', async () => {
    // expect(page).toBeDefined();

    const expected = 'Blogster';

    //extract header text
    const actual = await page.$eval('.brand-logo', (el) => el.innerHTML);

    // const text = await page.evaluate(() => document.body.textContent);
    expect(actual).toEqual(expected);
    console.log(actual);
    await browser.close();
    // setTimeout(async () => {
    // }, 2000);
  });
});
