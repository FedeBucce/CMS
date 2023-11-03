const APIURL = 'http://localhost:3000/api'

//--------------------------  Login-Logout


async function checkLogin(username, password) {
  try {
    const response = await fetch(APIURL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      }),
      credentials: 'include'
    });
    if (response.ok) {
      return await response.json();
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


async function doLogout() {
  try {
    const response = await fetch(APIURL + '/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


//--------------------------  get Page-Block


async function listPages() {
  try {
    const response = await fetch(APIURL + '/pages', {
      credentials: 'include'
    });
    if (response.ok) {
      const pages = await response.json();
      return pages;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error })
  }
}


async function getPageById(pageId) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}`, {
      credentials: 'include'
    });
    if (response.ok) {
      const page = await response.json();
      return page;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error })
  }
}


async function listBloksByPageId(pageId) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}/blocks`, {
      credentials: 'include'
    });
    if (response.ok) {
      const blocks = await response.json();
      return blocks;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error })
  }
}


//--------------------------  add Page-Block


async function addBlock(type, content, newOrderNumber, pageId) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}/block`, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "type": type,
        "content": content,
        "newOrderNumber": newOrderNumber
      }),
      credentials: 'include'
    });
    if (response.ok) {
      const id = Number(await response.text());
      return id;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


async function createPage(title, author, publicationDate) {
  try {
    const response = await fetch(APIURL + `/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, author, publicationDate }),
      credentials: 'include'
    });

    if (response.ok) {
      const id = Number(await response.text());
      return id;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + ' ' + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


//--------------------------  update Page-Block


async function updatePage(pageId, title, author, publicationDate) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "title": title,
        "author": author,
        "publicationDate": publicationDate
      }),
      credentials: 'include'
    });
    if (response.ok) {
      return true;
    } else {
      const message = response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


async function updateBlock(blockId, type, pageId, orderBlock, content) {
  try {
    const response = await fetch(APIURL + `/block/${blockId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "type": type,
        "pageId": pageId,
        "orderBlock": orderBlock,
        "content": content
      }),
      credentials: 'include'
    });
    if (response.ok) {
      return true;
    } else {
      const message = response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


//--------------------------  delete Page-Block


async function deletePage(pageId) {
  try {
    const response = await fetch(APIURL + `/pages/${pageId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      return null;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


async function deleteBlock(blockId) {
  try {
    const response = await fetch(APIURL + `/blocks/${blockId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (response.ok) {
      return null;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + " " + message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}


//--------------------------  WebAppName


async function getWebAppName() {
  try {
    const response = await fetch(APIURL + '/webappname',{
      credentials: 'include'
    });
    if (response.ok) {
      const name = await response.json();
      return name;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + ' ' + message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}


async function editWebAppName(newName) {
  try {
    const response = await fetch(APIURL + '/webappname', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newName,
      }),
      credentials: 'include'
    });

    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error(response.statusText + ' ' + message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}


export {
  checkLogin,
  doLogout,

  listPages,
  getPageById,
  listBloksByPageId,

  addBlock,
  createPage,

  updateBlock,
  updatePage,

  deletePage,
  deleteBlock,

  getWebAppName,
  editWebAppName
};