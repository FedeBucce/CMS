import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { updateBlock, getPageById, listBloksByPageId, deleteBlock } from './API';
import { ArrowUp, ArrowLeft, ArrowDown, Pen, Trash, PlusCircle } from 'react-bootstrap-icons';
import UserContext from './UserContext';
import dayjs from 'dayjs';

function BlocksList(props) {
  const { idPage } = useParams();
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [blocks, setBlocks] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [page, setPage] = useState([]);

  useEffect(() => {
    getPageById(idPage).then((p) => {
      setPage(p);
    });
    listBloksByPageId(idPage).then((b) => {
      setBlocks(b);
    });
    setWaiting(false);
  }, [idPage]);

  

  const handleDelete = async (blockToDelete) => {
    setWaiting(true);
    await deleteBlock(blockToDelete.id);
    const updatedBlocks = await listBloksByPageId(blockToDelete.pageId);
    setBlocks(updatedBlocks);
    setWaiting(false);
  };

  const handleEdit = async (block) => {
    const disType = isDisabled(block.type);
    navigate(`/pages/${idPage}/blocks/addBlock`, {
      state: { mode: 'edit', initialValue: block, disableType: disType },
    });
  };


  const handleOrder = async (currentBlock, orderType) => {
    setWaiting(true);

    if (orderType === 'up' || orderType === 'down') {
      const filteredBlocks = blocks.filter(block => (orderType === 'up' ? currentBlock.orderBlock > block.orderBlock : currentBlock.orderBlock < block.orderBlock));
      let minDiff = Infinity;
      let changeBlock;

      for (const block of filteredBlocks) {
        const diff = Math.abs(block.orderBlock - currentBlock.orderBlock);
        if (diff < minDiff) {
          minDiff = diff;
          changeBlock = block;
        }
      }

      if (changeBlock) {
        await updateBlock(currentBlock.id, currentBlock.type, page.id, changeBlock.orderBlock, currentBlock.content);
        await updateBlock(changeBlock.id, changeBlock.type, page.id, currentBlock.orderBlock, changeBlock.content);
        const updatedBlocks = await listBloksByPageId(page.id);
        setBlocks(updatedBlocks);
      }
    }

    setWaiting(false);
  };



  const isDisabled = (blockType) => {
    let hasHeader = 0;
    let hasParagraphOrImage = 0;

    for (const block of blocks) {
      if (block.type === 'header') {
        hasHeader++;
      } else if (block.type === 'paragraph' || block.type === 'image') {
        hasParagraphOrImage++;
      }
    }

    if (blockType === 'header') {
      return !(hasHeader > 1);
    } else {
      return !(hasParagraphOrImage > 1);
    }
  };

  const maxOrderBlock = blocks.length !== 0 ? Math.max(...blocks.map((block) => block.orderBlock)) : -1;
  const minOrderBlock = blocks.length !== 0 ? Math.min(...blocks.map((block) => block.orderBlock)) : -1;

  const renderBlocks = () => {
    return blocks.map((block, index) => {
      let content = null;

      if (block.type === 'header') {
        content = <h2 className="block-content">{block.content}</h2>;
      } else if (block.type === 'paragraph') {
        content = <p className="block-content">{block.content}</p>;
      } else if (block.type === 'image') {
        content = <img src={`/src/images/${block.content}.jpg`} alt="Image" />;
      }

      let dynamicContent = null;

      if (user.name === page.author || user.role === 'admin') {
        dynamicContent = (
          <Card key={block.id} className="block-card">
            <Card.Body>{content}</Card.Body>
            <Card.Footer>
              <Button variant="danger" style={{ marginLeft: '5px' }} onClick={() => handleDelete(block)} disabled={waiting || isDisabled(block.type)}>
                <Trash />
              </Button>
              <Button variant="warning" style={{ marginLeft: '5px' }} onClick={() => handleEdit(block)} disabled={waiting}>
                <Pen />
              </Button>
              {block.orderBlock !== minOrderBlock && (
                <Button variant="success" style={{ marginLeft: '5px' }} onClick={() => handleOrder(block, 'up')} disabled={waiting}>
                  <ArrowUp />
                </Button>
              )}
              {block.orderBlock !== maxOrderBlock && (
                <Button variant="success" style={{ marginLeft: '5px' }} onClick={() => handleOrder(block, 'down')} disabled={waiting}>
                  <ArrowDown />
                </Button>
              )}
            </Card.Footer>
          </Card>
        );
      } else {
        dynamicContent = <div key={block.id}>{content}</div>;
      }

      return (
        <div id={`block-${index}`} key={block.id} className="block-wrapper">
          {dynamicContent}
        </div>
      );
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1><Button variant="primary" onClick={() => navigate(`/`)}> <ArrowLeft/> </Button> {page ? page.title : ''}</h1>
        </Col>
        <Col className="text-end">
          Creation date: {page ? dayjs(page.creationDate).format('DD-MM-YYYY') : ''}
          <br />
          Publication date: {page.publicationDate ? dayjs(page.publicationDate).format('DD-MM-YYYY') : 'empty'}
        </Col>
      </Row>
      <Row>
        <hr className="my-4" />
      </Row>

      <div className="blocks-container">{renderBlocks()}</div>

      {(user.name === page.author || user.role === 'admin') && (
        <div className="fixed-center">
          <Button variant="primary" onClick={() => navigate(`/pages/${page.id}/blocks/addBlock`, { state: { mode: 'add', initialValue: maxOrderBlock } })}>
            <PlusCircle /> Add Block
          </Button>
        </div>
      )}
    </Container>
  );
}

export { BlocksList };
