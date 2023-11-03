'use strict';

const dayjs = require('dayjs');

function Page(id, title, author, creationDate, publicationDate) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.creationDate = dayjs(creationDate);
    this.publicationDate = (publicationDate ? dayjs(publicationDate) : undefined);
}

function Block(id, type, pageId, orderBlock, content) {
    this.id = id;
    this.type = type;
    this.pageId = pageId;
    this.orderBlock = orderBlock;
    this.content = content;
}

exports.Page = Page;
exports.Block = Block;