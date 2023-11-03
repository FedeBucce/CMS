import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useEffect, useState, useContext } from "react";
import UserContext from './UserContext';
import { Pen, PlusCircle, Trash } from 'react-bootstrap-icons';
import { deletePage, listPages } from './API';

function PageList(props) {
  const user = useContext(UserContext);
  const [waitingPage, setWaitingPage] = useState(false);
  const navigate = useNavigate();
  const [visiblePages, setVisiblePages] = useState([]);

  const filterPages = async () => {
    const pages = await listPages();

    if (user.role === 'admin') {
      setVisiblePages(pages);
    } else if (user.role === 'user') {
      const filteredPages = pages.filter((page) => {
        if (page.publicationDate === undefined || dayjs(page.publicationDate).isAfter(dayjs())) {
          return page.author === user.name;
        } else {
          return true;
        }
      });
      setVisiblePages(filteredPages);
    } else {
      const filteredPages = pages.filter((page) => page.publicationDate !== undefined && !dayjs(page.publicationDate).isAfter(dayjs()));
      setVisiblePages(filteredPages);
    }
  };

  useEffect(() => {
    filterPages();
  }, [user]);

  const handleDeletePage = async (pageId) => {
    setWaitingPage(true);
    await deletePage(pageId);
    filterPages();
    setWaitingPage(false);
  };

  const handleEdit = async (page) => {
    navigate(`/pages/addPage`, {
      state: { mode: 'edit', initialValue: page },
    });
  };

  return (
    <Container>
      <Row>
        {visiblePages.map((page) => (
          <Col key={page.id} md={4}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <Card.Title>{page.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Author: {page.author}</Card.Subtitle>
                    <Card.Text className="mb-2">
                      {page.publicationDate ? (
                        <>
                          <strong>Publication Date: </strong> {dayjs(page.publicationDate).format('DD-MM-YYYY')}
                        </>
                      ) : (
                        <>
                          <strong>Publication Date: </strong> empty
                        </>
                      )}
                    </Card.Text>
                    <Card.Text>
                      <strong>Creation Date:</strong> {dayjs(page.creationDate).format('DD-MM-YYYY')}
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-between">
                  <Link to={`/pages/${page.id}/blocks`} className="align-self-start">Details...</Link>
                  {(user.name === page.author || user.role === 'admin') && (
                    <Button variant="warning" onClick={() => handleEdit(page)} className="align-self-end" disabled={waitingPage}>
                      <Pen />
                    </Button>
                  )}
                  {(user.name === page.author || user.role === 'admin') && (
                    <Button variant="danger" onClick={() => handleDeletePage(page.id)} className="align-self-end" disabled={waitingPage}>
                      <Trash />
                    </Button>
                  )}
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {user.role && (
        <div className="fixed-center">
          <Button variant="primary" onClick={() => navigate(`/pages/addPage`, { state: { mode: 'add' } })} disabled={waitingPage}>
            <PlusCircle /> Add Page
          </Button>
        </div>
      )}
    </Container>
  );
}

export { PageList };
