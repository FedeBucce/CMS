import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from './UserContext';
import { createPage, listPages, updatePage, addBlock } from './API';
import dayjs from 'dayjs';

function AddEditPageForm(props) {
  const user = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, initialValue } = location.state;

  const [title, setTitle] = useState(mode === 'edit' ? initialValue.title : '');
  const [author, setAuthor] = useState(user.role === 'admin' && mode === 'edit' ? initialValue.author : user.name);
  const [publicationDate, setPublicationDate] = useState(mode === 'edit' ? (initialValue.publicationDate ? dayjs(initialValue.publicationDate) : null) : null);
  const [waiting, setWaiting] = useState(false);

  const isDisabled = () => {
    return !title.length || waiting;
  };

  const handleCancel = () => {
    navigate(`/`);
  };

  const handleAdd = async () => {
    if (!title || !author) {
      return;
    }
    setWaiting(true);

    try {
      const id = await createPage(title, author, publicationDate);

      await addBlock('header', 'Contenuto header', 0, id);
      await addBlock('paragraph', 'Contenuto paragrafo', 1, id);
      const pages = await listPages();
      props.setPages(pages);
      navigate(`/pages/${id}/blocks`);
    } catch (error) {
      console.log('Error adding page:', error);
    }

    setWaiting(false);
  };

  const handleSave = async () => {
    try {
      setWaiting(true);
      await updatePage(initialValue.id, title, author, publicationDate);
      const pages = await listPages();
      props.setPages(pages);
      navigate(`/`);
    } catch (error) {
      console.log('Error updating page:', error);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div>
      {mode === 'add' ? <h1>Add New Page</h1> : <h1>Edit Page</h1>}
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" maxLength={25} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formAuthor">
        <Form.Label>Author</Form.Label>
        <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} disabled={user.role !== 'admin'} required />
      </Form.Group>

      <Form.Group controlId="formPublicationDate">
        <Form.Label>Publication Date</Form.Label>
        <Form.Control type="date" value={publicationDate ? publicationDate.format('YYYY-MM-DD') : ''} onChange={(e) => setPublicationDate(dayjs(e.target.value))} />
      </Form.Group>

      {mode === 'add' && (
        <Button onClick={() => handleAdd()} variant="primary" type="submit" className="mt-2" disabled={isDisabled() || waiting}>
          Add page
        </Button>
      )}

      {mode === 'edit' && (
        <Button onClick={() => handleSave()} variant="primary" type="submit" className="mt-2" disabled={isDisabled() || waiting}>
          Save page
        </Button>
      )}

      <Button onClick={() => handleCancel()} variant="secondary" type="button" className="mt-2" style={{ marginLeft: '5px' }}>
        Cancel
      </Button>
    </div>
  );
}

export { AddEditPageForm };
