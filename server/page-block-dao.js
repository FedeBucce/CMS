'use strict';

const { Page, Block } = require('./page-block');

const sqlite = require('sqlite3');

const db = new sqlite.Database('cms.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }

  // db.run(`
  //   CREATE TABLE IF NOT EXISTS pages (
  //     id INTEGER PRIMARY KEY,
  //     title TEXT,
  //     author TEXT,
  //     creationDate TEXT,
  //     publicationDate TEXT
  //   )
  // `);

  // db.run(`
  //   CREATE TABLE IF NOT EXISTS blocks (
  //     id INTEGER PRIMARY KEY,
  //     type TEXT,
  //     pageId INTEGER,
  //     orderBlock INTEGER,
  //     content TEXT,
  //     FOREIGN KEY (pageId) REFERENCES pages(id)
  //   )
  // `);
});


//--------------------------  get Page-Block


async function getAllPages() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM pages ORDER BY publicationDate ', async (err, rows) => {
      if (err) {
        reject(new Error('Failed to fetch pages'));
      } else {
        const pages = [];
        for (const row of rows) {
          const page = new Page(row.id, row.title, row.author, row.creationDate, row.publicationDate);
          pages.push(page);
        }
        resolve(pages);
      }
    });
  });
}


async function getPageById(pageId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM pages WHERE id = ?', pageId, (err, row) => {
      if (err) {
        reject(new Error('Failed to fetch page'));
      } else {
        const page = new Page(row.id, row.title, row.author, row.creationDate, row.publicationDate);
        resolve(page);
      }
    });
  });
}


async function getBlocksByPageId(pageId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM blocks WHERE pageId = ? ORDER BY orderBlock', pageId, (err, rows) => {
      if (err) {
        reject(new Error('Failed to fetch blocks'));
      } else {
        const blocks = rows.map((row) => {
          return new Block(row.id, row.type, row.pageId, row.orderBlock, row.content);
        });
        resolve(blocks);
      }
    });
  });
}


//--------------------------  add Page-Block


async function createBlock(pageId, block) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO blocks (pageId, type, orderBlock, content) VALUES (?, ?, ?, ?)', [pageId, block.type, block.orderBlock, block.content], async (err, rows) => {
      if (err) {
        reject(new Error('Failed to delete page'));
      } else {
        resolve();
      }
    });
  });
}


async function createPage(page) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO pages (title, author, creationDate, publicationDate) VALUES (?, ?, ?, ?)';
    db.run(sql, [page.title, page.author, page.creationDate.toISOString(), (page.publicationDate ? page.publicationDate.toISOString() : undefined)], function (err) {
      if (err)
        reject(err.message);
      else
        resolve(this.lastID);
    });
  });
}


//--------------------------  update Page-Block


function updatePage(pageId, title, author, publicationDate) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE pages SET title = ?, publicationDate = ?, author = ? WHERE id = ?';
    db.run(sql, [title, publicationDate, author, pageId], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve();
      }
    });
  });
}


async function updateBlock(blockId, type, pageId, orderBlock, content) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE blocks SET type = ?, orderBlock = ?, content = ? WHERE id = ? AND pageId = ?';
    db.run(sql, [type, orderBlock, content, blockId, pageId], function (err) {
      if (err) {
        reject(new Error('Failed to update blocks'));
      } else {
        resolve();
      }
    });
  });
}


//--------------------------  delete Page-Block


async function deletePage(pageId) {
  return new Promise((resolve, reject) => {
    const sql1 = 'DELETE FROM pages WHERE id = ?';
    db.run(sql1, [pageId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });

    const sql2 = 'DELETE FROM blocks WHERE pageId = ?';
    db.run(sql2, [pageId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  })
}



function deleteBlock(blockId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM blocks WHERE id = ?';
    db.run(sql, [blockId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


exports.getAllPages = getAllPages;
exports.getPageById = getPageById;
exports.getBlocksByPageId = getBlocksByPageId;

exports.createBlock = createBlock;
exports.createPage = createPage;

exports.updateBlock = updateBlock;
exports.updatePage = updatePage;

exports.deletePage = deletePage;
exports.deleteBlock = deleteBlock;







