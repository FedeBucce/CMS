import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { editWebAppName} from './API';


function EditWebAppNameForm(props) {
  const location = useLocation();
  const { oldName } = location.state;

  const [name, setName] = useState(oldName ? oldName : '');
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();


  const handleSave = async () => {
    setWaiting(true)
    await editWebAppName(name);
    props.setWebAppName({name: name});
    setWaiting(false)
    navigate(`/`);
  };

  const handleCancel = () => {
    navigate(`/`);
  };

  return (
    <div>
      <h2>Edit Web App Name</h2>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Button variant="primary"  className="mt-2" onClick={handleSave} disabled = {waiting}>
        Save
      </Button>{' '}
      <Button variant="secondary"  className="mt-2" onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
}

export {EditWebAppNameForm} ;
