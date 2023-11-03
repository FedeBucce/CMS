const crypto = require('crypto');
const sqlite = require('sqlite3');

const db = new sqlite.Database('cms.sqlite', (err) => {
    if (err) throw err;

    // const createTableUsers = `
    //     CREATE TABLE IF NOT EXISTS users (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         email TEXT NOT NULL,
    //         name TEXT NOT NULL,
    //         role TEXT NOT NULL,
    //         salt TEXT NOT NULL,
    //         password TEXT NOT NULL
    //     )`;

    //    const sql = 'INSERT INTO users(email, name, role, salt, password) VALUES(?,?,?,?,?)';
    //    db.run(sql, ["admin@gmail.com", "Federico Buccellato", "admin", "9a58a8e5f64ef94b", "9c750b33738473277e0ecb1ad9f77ed51918d1d781f7f3fe47263df5c79f16da"], (err) => {
    //        if (err)
    //            console.log(err.message)
    //   });

    // const sql = 'DELETE FROM users WHERE email = ?';
    //     db.run(sql, ['user1@gmail.com'], function (err) {
    //       if (err) {
    //         throw new Error(err.message);
    //       }

    //     });

});


function getUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email=?';
        db.get(sql, [username], (err, row) => {
            if (err) { // database error
                reject(err);
            } else {
                if (!row) { // non-existent user
                    reject('Invalid username or password');
                } else {
                    crypto.scrypt(password, row.salt, 32, (err, computed_hash) => {
                        if (err) { // key derivation fails
                            reject(err);
                        } else {
                            const equal = crypto.timingSafeEqual(computed_hash, Buffer.from(row.password, 'hex'));
                            if (equal) { // password ok
                                resolve(row);
                            } else { // password doesn't match
                                reject('Invalid username or password');
                            }
                        }
                    });
                }
            }
        });
    });
}

exports.getUser = getUser;