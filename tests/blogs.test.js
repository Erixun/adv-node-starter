const Page = require('./helpers/CustomPage.js');

async function getContentsOf(selector) {
  await this.waitForSelector(selector);
  return this.$eval(selector, (el) => el.innerHTML);
}

xdescribe('When logged in', () => {
  let page, blogTitle, blogContent;

  beforeEach(async () => {
    page = await Page.build();
  });

  afterEach(async () => {
    page.close();
  });

  it('displays blog create form', async () => {
    await page.login();

    const btnCreate = 'a[href="/blogs/new"]';

    await page.click(btnCreate);
    const formLabel = '.title label';
    await page.waitForSelector(formLabel);
    const label = await getContentsOf.bind(page)(formLabel); //page.$eval(formLabel, (el) => el.innerHTML); //  getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.login();
      await page.click('a[href="/blogs/new"]');
      await page.click('form button');
    });

    it('shows error message', async () => {
      getContentsOf = getContentsOf.bind(page);
      const titleError = await page.$eval(
        '.title .red-text',
        (el) => el.innerHTML
      );
      const contentError = await page.$eval(
        '.content .red-text',
        (el) => el.innerHTML
      );

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });

  xdescribe('Submit using valid inputs', () => {
    beforeEach(async () => {
      await page.login();
      await page.click('a[href="/blogs/new"]');
      await page.click('form button');

      blogTitle = 'My Blog Title';
      blogContent = 'My Blog Content';

      await page.waitForSelector('.title input');

      await page.type('.title input', blogTitle);
      await page.type('.content input', blogContent);
      await page.click('form button');
    });

    it('shows review screen', async () => {
      //await page.waitForTimeout(3000); // Selector('h5');
      const text = await getContentsOf.bind(page)('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    it('shows blog in index page upon confirmation of review', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card');
      getContentsOf = getContentsOf.bind(page);

      const title = await getContentsOf('.card-title');
      const content = await getContentsOf('p:last-child');

      expect(title).toEqual(blogTitle);
      expect(content).toEqual(blogContent);
    });
  });
});

describe('When not logged in', () => {
  let page;
  beforeEach(async () => {
    page = await Page.build();
  });

  afterEach(async () => {
    page.close();
  });

  it('cannot create blog posts', async () => {
    const result = await fetch('http://localhost:3000/api/blogs', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'My Title',
        content: 'My Content',
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
        return error;
      });

    expect(result).toEqual({ error: 'You must log in!' });
  });

  it('cannot get blog posts', async () => {
    const result = await fetch('http://localhost:3000/api/blogs', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await result.json();
    console.log(json);

    expect(json).toEqual({ error: 'You must log in!' });
  });
});
