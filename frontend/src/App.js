import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Alert, Col, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
// import logo from './logo.svg';
import './App.css';
import AlertContextProvider from './components/AlertContext';
import AssignUsers from './components/AssignUsers';
import CreateIssuePage from './components/CreateIssue';
import CreateProjectPage from './components/CreateProject';
import EditProject from './components/EditProject';
import IssuePage from './components/IssuePage';
import MainPage from './components/MainPage';
import ProjectPage from './components/ProjectPage';
import LoginPage from './components/SigninPage';
import SignupPage from './components/SignupPage';
import UserContext from './components/UserContext';
import EditUserDetails from './components/EditUserDetails';

function HeaderLayout(props) {
  // see if the user is logged in, and if the user is then only show the log out button 
  const userId = useContext(UserContext).userid;
  // show the top link conditionally
  let logOut = userId && <><NavItem style={{ float: 'right', listStyleType: 'none' }}>
    <NavLink href="/login" onClick={() => { Cookies.remove("session") }}>
      Logout
    </NavLink>
  </NavItem>
    <NavItem style={{ float: 'right', listStyleType: 'none' }}>
      <NavLink href="/user">
        Edit Profile
     </NavLink>
    </NavItem></>;
  return (<div>
    <div className="container-fluid-nav text-center">
      <Navbar color="dark" dark >
        <Col></Col>
        <Col>
          <NavbarBrand><h1 className="HeaderFontFamily">Issuez</h1></NavbarBrand>
        </Col>
        <Col>
          {logOut}
        </Col>
      </Navbar>
      {props.children}
    </div>
  </div>);
}



// creating a global context for alert 
const AlertMessage = ({ children }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('warning');
  const showMessage = (message, color = 'warning') => {
    setShowDialog(true); setMessage(message);
    setColor(color);
  }
  // close the dialog after 2s .
  if (showDialog === true) {
    window.setTimeout(() => setShowDialog(false), 2000);
  }
  return (<>
    <AlertContextProvider.Provider value={{ showMessage }}>
      {showDialog && <Alert color={color} toggle={() => setShowDialog(false)}>
        {message}
      </Alert>}
      {children}
    </AlertContextProvider.Provider>
  </>);
}


// handling login session by cookies 


const getSessionCookie = () => {
  const currentlyUserId = Cookies.get("session");
  if (currentlyUserId === undefined) {
    return '';
  }
  else {
    return Cookies.get("session");
  }
}


// create a global context for the currently authenticated user 
const CurrentlyAuthenticatedUser = (props) => {
  const [userId, setUserId] = useState(getSessionCookie());
  const setSessionCookie = (userid) => {
    Cookies.remove("session");
    Cookies.set("session", userid, { expires: 1 });
    // also set user id here 
    setUserId(userid);
  }
  return (<>
    <UserContext.Provider value={{ userid: userId, setUserId: setSessionCookie }}>
      {props.children}
    </UserContext.Provider>
  </>)
}


function App() {
  // changes the title to Issuez
  useEffect(() => {
    document.title = "Issuez"
  }, []);
  return (
    <Router>
      <CurrentlyAuthenticatedUser>
        <HeaderLayout>
          <AlertMessage>
            <Switch>
              <Route exact path="/dashboard">
                <MainPage />
              </Route>
              <Route exact path="/signup">
                <SignupPage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/project/:projectid">
                <ProjectPage />
              </Route>
              <Route exact path="/createproject">
                <CreateProjectPage />
              </Route>
              <Route path="/issue/:issueid">
                <IssuePage />
              </Route>
              <Route path="/assign/issue/:issueid">
                <AssignUsers assign='issue' />
              </Route>
              <Route path="/assign/project/:projectid">
                <AssignUsers assign='project' />
              </Route>
              <Route exact path="/project/:projectid/issue/:issueid">
                <CreateIssuePage />
              </Route>
              <Route exact path="/project/:projectid/issue">
                <CreateIssuePage />
              </Route>
              <Route exact path="/project/:projectid/edit">
                <EditProject />
              </Route>
              <Route exact path="/">
                {getSessionCookie() === '' && <Redirect to="/login" />}
                {getSessionCookie() !== '' && <Redirect to="/dashboard" />}
              </Route>
              <Route exact path="/user">
                <EditUserDetails />
              </Route>
            </Switch>
          </AlertMessage>
        </HeaderLayout>
      </CurrentlyAuthenticatedUser>
    </Router>
  );
}

export default App;
