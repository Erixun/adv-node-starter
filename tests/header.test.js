const puppeteer = require('puppeteer');

describe('Addition', () => {
  it('knows that 2 and 2 make 4', () => {
    const expected = 4;
    const actual = 2 + 2;

    expect(actual).toBe(expected);
  });
});

//Write a test for launching the browser:
describe('Header', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('has the correct text', async () => {
    const expected = 'Blogster';
    const className = '.brand-logo';

    //there is nothing magic about the $-sign.
    const actual = await page.$eval(className, (el) => el.innerHTML);

    expect(actual).toEqual(expected);
  });

  it('clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
  });
});
