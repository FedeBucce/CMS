import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { addBlock, updateBlock } from './API';
import { useLocation } from 'react-router-dom';

function AddBlockForm() {
  const location = useLocation();
  const { mode, initialValue, disableType } = location.state;

  const [blockType, setBlockType] = useState(mode === 'edit' ? initialValue.type : '');
  const [headerText, setHeaderText] = useState(mode === 'edit' && initialValue.type === 'header' ? initialValue.content : '');
  const [paragraphText, setParagraphText] = useState(mode === 'edit' && initialValue.type === 'paragraph' ? initialValue.content : '');
  const [selectedImage, setSelectedImage] = useState(mode === 'edit' && initialValue.type === 'image' ? initialValue.content : '');
  const [waiting, setWaiting] = useState(false);

  const { idPage } = useParams();

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/pages/${idPage}/blocks`);
  };

  const handleAdd = async () => {
    const newOrderNumber = parseInt(initialValue) + 1;
    let content = blockType === 'header' ? headerText : blockType === 'paragraph' ? paragraphText : selectedImage;
    setWaiting(true);
    try {
      await addBlock(blockType, content, newOrderNumber, idPage);
      navigate(`/pages/${idPage}/blocks`);
    } catch (error) {
      console.log('Error adding block:', error);
    }
    setWaiting(false);
  };

  const handleSave = async () => {
    let content = blockType === 'header' ? headerText : blockType === 'paragraph' ? paragraphText : selectedImage;
    setWaiting(true);
    try {
      await updateBlock(initialValue.id, blockType, initialValue.pageId, initialValue.orderBlock, content);
      navigate(`/pages/${idPage}/blocks`);
    } catch (error) {
      console.log('Error updating block:', error);
    }
    setWaiting(false);
  };

  const isDisabled = () => {
    if (blockType === 'header') return !headerText.length;

    if (blockType === 'paragraph') return !paragraphText.length;

    if (blockType === 'image') return !selectedImage.length;

    return true;
  };


  return (
    <Container>
      <Form >
        {mode === 'add' ? <h1>Add New Block</h1> : <h1>Edit Block</h1>}
        <Form.Group controlId="blockTypeSelect">
          <Form.Label>
            Select Block Type:
            {disableType && blockType !== 'header' ?
              <span style={{ color: 'red' }}>  THERE MUST BE AT LEAST ONE PARAGRAPH/IMAGE !!!  </span>
              :
              disableType && blockType === 'header' ?
                <span style={{ color: 'red' }}>  THERE MUST BE AT LEAST ONE HEADER !!!  </span>
                :
                null}
          </Form.Label>
          <Form.Control as="select" value={blockType} onChange={(e) => { setBlockType(e.target.value); }} required>
            <option disabled={disableType && blockType === 'header'} value="">Choose...</option>
            <option disabled={disableType && blockType !== 'header'} value="header">Header</option>
            <option disabled={disableType && blockType === 'header'} value="paragraph">Paragraph</option>
            <option disabled={disableType && blockType === 'header'} value="image">Image</option>
          </Form.Control>
        </Form.Group>

        {blockType === 'header' && (
          <Form.Group controlId="headerTextInput">
            <Form.Label>Header Text :</Form.Label>
            <Form.Control as="textarea" maxLength={30} value={headerText} onChange={(e) => { setHeaderText(e.target.value); }} required />
          </Form.Group>
        )}

        {blockType === 'paragraph' && (
          <Form.Group controlId="paragraphTextInput">
            <Form.Label>Paragraph Text:</Form.Label>
            <Form.Control as="textarea" rows={3} value={paragraphText} onChange={(e) => { setParagraphText(e.target.value); }} required />
          </Form.Group>
        )}

        {blockType === 'image' && (
          <Form.Group controlId="imageSelect">
            <Form.Label>Select Image:</Form.Label>
            <Form.Control as="select" value={selectedImage} onChange={(e) => { setSelectedImage(e.target.value); }} required>
              <option value="">Choose...</option>
              <option value="computer">Computer</option>
              <option value="water">Water</option>
              <option value="bike">Bike</option>
              <option value="dog">Dog</option>
            </Form.Control>
          </Form.Group>
        )}
      </Form>

      {mode === 'add' && (
        <Button onClick={() => handleAdd()} variant="primary" type="submit" className="mt-2" disabled={isDisabled() || waiting}>
          Add Block
        </Button>
      )}
      {mode === 'edit' && (
        <Button onClick={() => handleSave()} variant="primary" type="submit" className="mt-2" disabled={isDisabled() || waiting}>
          Save Block
        </Button>
      )}

      <Button onClick={() => handleCancel()} variant="secondary" type="button" className="mt-2" style={{ marginLeft: '5px' }}>
        Cancel
      </Button>
    </Container>
  );
}

export { AddBlockForm };
