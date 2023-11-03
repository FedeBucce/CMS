'use strict';

const PORT = 3000;

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const { Page, Block } = require('./page-block');

const userdao = require('./user-dao');
const pageblockdao = require('./page-block-dao');
const webappnamedao = require('./web-app-name-dao');

const app = express();
app.use(morgan('combined'));
app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: 'xxxxyyyyzzz', resave: false, saveUninitialized: false
}));

passport.use(new LocalStrategy((username, password, callback) => {
  userdao.getUser(username, password).then((user) => {
    callback(null, user);
  }).catch((err) => {
    callback(null, false, err)
  });
}));

passport.serializeUser((user, callback) => {
  callback(null, { id: user.id, email: user.email, name: user.name });
});
passport.deserializeUser((user, callback) => {
  callback(null, user);
});

app.use(passport.authenticate('session'));

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      return res.status(500).send("Not authenticated");
  }
}

//--------------------------  Login-Logout


app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});


app.post('/api/logout', (req, res) => {
  req.logout(() => { res.end() });
})


//--------------------------  get Page-Block


app.get('/api/pages', (req, res) => {
  pageblockdao.getAllPages()
    .then((pages) => {
      res.json(pages);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


app.get('/api/pages/:pageId', (req, res) => {
  const pageId = req.params.pageId;

  pageblockdao.getPageById(pageId)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


app.get('/api/pages/:pageId/blocks', (req, res) => {
  const pageId = req.params.pageId;

  pageblockdao.getBlocksByPageId(pageId)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


//--------------------------  get-WebAppName


app.get('/api/webappname', (req, res) => {
  webappnamedao.getWebAppName()
    .then((name) => {
      res.json(name);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


//--------------------------  from now the API require the authentication


app.use(isLogged);


//--------------------------  add Page-Block


app.post('/api/pages/:pageId/block', (req, res) => {
  const pageId = req.params.pageId;
  const block = new Block(null, req.body.type, pageId, req.body.newOrderNumber, req.body.content);

  pageblockdao.createBlock(pageId, block).then((result) => {
    res.end();
  }).catch((error) => {
    res.status(500).send(error.message);
  })
});


app.post('/api/pages', (req, res) => {
  const { title, author, publicationDate } = req.body;

  const page = new Page(null, title, author, new Date(), publicationDate);

  pageblockdao.createPage(page)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


//--------------------------  update Page-Block


app.put('/api/pages/:pageId', (req, res) => {
  const pageId = req.params.pageId;
  const { title, publicationDate, author } = req.body;

  pageblockdao.updatePage(pageId, title, author, publicationDate)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


app.put('/api/block/:blockId', (req, res) => {
  const blockId = req.params.blockId;
  const { type, pageId, orderBlock, content } = req.body;

  pageblockdao.updateBlock(blockId, type, pageId, orderBlock, content)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


//--------------------------  delete Page-Block


app.delete('/api/pages/:pageId', (req, res) => {
  const pageId = req.params.pageId;

  pageblockdao.deletePage(pageId)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


app.delete('/api/blocks/:blockId', (req, res) => {
  const blockId = req.params.blockId;

  pageblockdao.deleteBlock(blockId)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


//--------------------------  put-WebAppName


app.put('/api/webappname', (req, res) => {
  const newName = req.body.name;

  webappnamedao.editWebAppName(newName)
    .then(() => {
      res.end();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});


app.listen(PORT,
  () => { console.log(`Server started on http://localhost:${PORT}/`) }
);
