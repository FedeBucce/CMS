import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { useContext, useEffect, useState } from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { BrowserRouter, Link, Outlet, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import { Pen } from 'react-bootstrap-icons';

import UserContext from './UserContext';

import { getWebAppName, listPages, checkLogin, doLogout } from './API';
import { BlocksList } from './BlocksList';
import { LoginForm } from './Login';
import { PageList } from "./PageList";
import { AddBlockForm } from "./AddEditBlockForm";
import { AddEditPageForm } from "./AddEditPageForm";
import { EditWebAppNameForm } from "./EditWebAppNameForm";
import { PageNotFound } from "./PageNotFound";

function App() {
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState({});
  const [webAppName, setWebAppName] = useState({});

  const validateLogin = async (username, password) => {
    const user = await checkLogin(username, password);
    setUser(user);
  }

  const handleLogout = async () => {
    await doLogout();
    setUser({});
  }

  useEffect(() => {
    listPages().then((list) => {
      setPages(list);
    })
    getWebAppName().then((name) => {
      setWebAppName(name)
    })
  }, []);

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout handleLogout={handleLogout} webAppName={webAppName} />}>
            <Route index element={<PageList pages={pages} setPages={setPages} />} />
            <Route path='/pages/:idPage/blocks' element={<BlocksList />} />
            <Route path='/pages/:idPage/blocks/addBlock' element={<AddBlockForm />} />
            <Route path='/pages/addPage' element={<AddEditPageForm setPages={setPages} />} />
            <Route path='/editWebAppName' element={<EditWebAppNameForm setWebAppName={setWebAppName} />} />
            <Route path='/login' element={<LoginForm validateLogin={validateLogin} />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

function MainLayout(props) {
  const user = useContext(UserContext);
  const currentPath = window.location.pathname;
  const navigate = useNavigate();

  const isDisabled = () => {
    if(currentPath.endsWith('/addPage') || currentPath.endsWith('/blocks/addBlock') || currentPath === '/editWebAppName') return false;
    return true;
  };

  return (
    <>
      <header>
        <Navbar className="navbar navbar-expand-md navbar-dark bg-primary navbar-padding">
          {user.role === 'admin' && (
            <Button variant="warning" onClick={() => navigate(`/editWebAppName`, {
              state: { oldName: props.webAppName.name },
            })}>
              <Pen />
            </Button>
          )}
          <Container>
            <Navbar.Brand>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                {props.webAppName.name}
              </Link>
            </Navbar.Brand>
            <Navbar.Text>
              {user.id ? (
                <span>
                  <>{user.name}  </>
                  {isDisabled() ? <Link onClick={props.handleLogout}>Logout</Link> : ''}
                </span>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </Navbar.Text>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}

export default App
