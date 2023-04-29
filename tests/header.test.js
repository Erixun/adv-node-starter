const puppeteer = require('puppeteer');

describe('Addition', () => {
  it('knows that 2 and 2 make 4', () => {
    const expected = 4;
    const actual = 2 + 2;

    expect(actual).toBe(expected);
  });
});

//Write a test for launching the browser:
describe('Launching the browser', () => {
  it('launches the browser', async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    expect(page).toBeDefined();
    setTimeout(async () => {
      await browser.close();
    }, 2000);
  });
});
