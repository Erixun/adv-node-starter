const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory.js');
const userFactory = require('../factories/userFactory.js');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    const superPage = new Proxy(customPage, {
      get(target, property) {
        if (target[property]) {
          console.log('target[property]', target[property]);
          return target[property].bind(target);
        }

        const [thisArg, fn] =
          property in browser
            ? [browser, browser[property]]
            : [page, page[property]];

        if (fn instanceof Function)
          return function (...args) {
            return fn.apply(thisArg, args);
          };

        return fn;
      },
    });

    return superPage;
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { sessionString, sig } = sessionFactory(user);

    const url = 'http://localhost:3000/blogs';

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
    await this.page.waitForSelector('a[href="/auth/logout"]');
  }
}

module.exports = CustomPage;
