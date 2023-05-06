const puppeteer = require('puppeteer');

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

  it('starts oauth flow when login is clicked', async () => {
    await page.click('.right a');
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
  });

  it('shows logout button when signed in', async () => {
    const id = '6436f497db439599c00b90fd';
    const sessionObject = { passport: { user: id } };
    const SafeBuffer = require('safe-buffer').Buffer;
    const sessionString = SafeBuffer.from(
      JSON.stringify(sessionObject)
    ).toString('base64');
    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    console.log('sessionString', sessionString);
    console.log('sig', sig);

    await page.setCookie({
      name: 'session',
      value: sessionString,
      url: 'http://localhost:3000/',
    });
    await page.setCookie({
      name: 'session.sig',
      value: sig,
      url: 'http://localhost:3000/',
    });
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('a[href="/auth/logout"]');
    // await page.waitForTimeout(4000);

    const actual = await page.$eval(
      'a[href="/auth/logout"]',
      (el) => el.innerHTML
    );
    const expected = 'Logout';

    expect(actual).toEqual(expected);
  });
});
