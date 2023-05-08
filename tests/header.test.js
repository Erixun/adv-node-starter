const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory.js');
const userFactory = require('./factories/userFactory.js');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    // this.close = browser.close;
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    //create a proxy for the page object
    const superPage = new Proxy(customPage, {
      get(target, property, receiver) {
        if (target[property]) return target[property].bind(target);

        if (browser[property]) {
          const func = browser[property].bind(browser);
          return function (...args) {
            return func.apply(browser, args);
          };
        }
        const value = page[property];
        if (value instanceof Function)
          return function (...args) {
            return value.apply(this === receiver ? page : this, args);
          };

        return value;
      },
    });
    // superPage.close = browser.close;
    return superPage;
  }

  constructor(page) {
    this.page = page;
  }

  // close() {
  //   this.browser.close();
  // }

  async login() {
    const user = await userFactory();

    const { sessionString, sig } = sessionFactory(user);

    const url = 'http://localhost:3000/';

    await this.page.setCookie({
      name: 'session',
      value: sessionString,
      url,
    });
    await this.page.setCookie({
      name: 'session.sig',
      value: sig,
      url,
    });
    await this.page.goto(url);
  }
}

describe('Header', () => {
  let browser, page;

  beforeAll(async () => {
    // browser = await pup.launch({
    //   headless: false,
    // });
    // page = await browser.newPage();
    page = await CustomPage.build();
    // await page.login();
    await page.goto('http://localhost:3000/');
    // await page.login();
  });

  afterAll(async () => {
    await page.close();
    // await browser.close();
    // await mongoose.disconnect();
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
    console.log('HELLOOOOOOOOO');
    await page.login();
    // const id = '6436f497db439599c00b90fd';
    // const sessionObject = { passport: { user: id } };
    // const SafeBuffer = require('safe-buffer').Buffer;
    // const sessionString = SafeBuffer.from(
    //   JSON.stringify(sessionObject)
    // ).toString('base64');
    // const Keygrip = require('keygrip');
    // const keys = require('../config/keys');
    // const keygrip = new Keygrip([keys.cookieKey]);
    // const sig = keygrip.sign('session=' + sessionString);
    // try {
    // } catch (error) {
    //   console.log(error);
    // }
    const user = await userFactory();
    console.log('user', user);
    const { sessionString, sig } = sessionFactory(user);
    console.log('sessionString', sessionString);
    console.log('sig', sig);

    const url = 'http://localhost:3000/';

    // await page.setCookie({
    //   name: 'session',
    //   value: sessionString,
    //   url,
    // });
    // await page.setCookie({
    //   name: 'session.sig',
    //   value: sig,
    //   url,
    // });
    await page.goto(url);
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

// const sessionFactory = (user) => {
//   const sessionObject = { passport: { user: user._id.toString() } };
//   const SafeBuffer = require('safe-buffer').Buffer;
//   const sessionString = SafeBuffer.from(JSON.stringify(sessionObject)).toString(
//     'base64'
//   );
//   const Keygrip = require('keygrip');
//   const keys = require('../config/keys');
//   const keygrip = new Keygrip([keys.cookieKey]);
//   const sig = keygrip.sign('session=' + sessionString);

//   return { sessionString, sig };
// };
//ideally we would create a new user for each test, but that would require
