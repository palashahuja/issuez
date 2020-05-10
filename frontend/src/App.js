import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Alert, Navbar, NavbarBrand } from 'reactstrap';
// import logo from './logo.svg';
import './App.css';
import AlertContextProvider from './components/AlertContext';
import CreateIssuePage from './components/CreateIssue';
import CreateProjectPage from './components/CreateProject';
import IssuePage from './components/IssuePage';
import MainPage from './components/MainPage';
import ProjectPage from './components/ProjectPage';
import LoginPage from './components/SigninPage';
import SignupPage from './components/SignupPage';
import UserContext from './components/UserContext';

function HeaderLayout(props) {
  return (<div>
    <div className="container-fluid-nav text-center">
      <Navbar color="dark" dark style={{ display: 'block' }}>
        <NavbarBrand><h1 className="HeaderFontFamily">Issuez</h1></NavbarBrand>
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
  const showMessage = (message, color='warning') => {
    setShowDialog(true); setMessage(message);
    setColor(color);
  }
  // close the dialog after 2s .
  if(showDialog === true){
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


// create a global context for the currently authenticated user 
const CurrentlyAuthenticatedUser = (props) => {
  const [userId, setUserId] = useState(1);
  return (<>
    <UserContext.Provider value={{userid: userId, setUserId: setUserId}}>
      {props.children}
    </UserContext.Provider>
  </>)
}


function App() {
  return (
    <Router>
      <HeaderLayout>
        <AlertMessage>
          <Switch>
            <CurrentlyAuthenticatedUser>
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
              <Route exact path="/project/:projectid/issue/:issueid">
                <CreateIssuePage />
              </Route>
              <Route exact path="/project/:projectid/issue">
                <CreateIssuePage />
              </Route>
              {/* <Redirect from="/" exact to="/login" /> */}
            </CurrentlyAuthenticatedUser>
          </Switch>
        </AlertMessage>
      </HeaderLayout>
    </Router>
  );
}

export default App;
