'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('cms.sqlite', (err) => {
    if (err) throw err;

    // const createTable = `
    //     CREATE TABLE IF NOT EXISTS webappname (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     name TEXT NOT NULL
    //     )
    // `;

    // db.run(createTable, (error) => {
    //   if (error) {
    //     console.error('Error creating table:', error.message);
    //   } else {
    //     console.log('Table created successfully');
    //   }
    // });

});


function getWebAppName() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM webappname';
        db.get(sql, (err, row) => {
            if (err)
                reject(err)
            else {
                const name = { "name": row.name }
                resolve(name);
            }
        });
    });
};

function editWebAppName(name) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE webappname SET name=?`;

        db.run(sql, [name], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}

exports.getWebAppName = getWebAppName;
exports.editWebAppName = editWebAppName;