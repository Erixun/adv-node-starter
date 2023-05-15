const Page = require('./helpers/CustomPage.js');

describe('Header', () => {
  let page;

  beforeAll(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000/');
  });

  afterAll(async () => {
    await page.close();
  });

  it('has the correct text', async () => {
    const className = '.brand-logo';
    const expected = 'Blogster';

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
    const linkLogout = 'a[href="/auth/logout"]';
    const expected = 'Logout';

    await page.login();
    // await page.waitForSelector(linkLogout);
    const actual = await page.$eval(linkLogout, (el) => el.innerHTML);

    expect(actual).toEqual(expected);
  });
});
