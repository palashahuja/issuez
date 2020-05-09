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



const AlertMessage = ({ children }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState('');
  const showMessage = (message) => {
    setShowDialog(true); setMessage(message);
  }
  // close the dialog after 2s .
  if(showDialog === true){
    window.setTimeout(() => setShowDialog(false), 2000);
  }
  return (<>
    <AlertContextProvider.Provider value={{ showMessage }}>
      {showDialog && <Alert color='warning' toggle={() => setShowDialog(false)}>
        {message}
      </Alert>}
      {children}
    </AlertContextProvider.Provider>
  </>);
}


// creating a global context for alert 


// creating a global context for the currently authenticated user 
function App() {
  return (
    <Router>
      <HeaderLayout>
        <AlertMessage>
          <Switch>
            <UserContext.Provider value={{ userid: 1 }}>
              <Route path="/dashboard">
                <MainPage userid="1" />
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
              <Route exact path="/project/:projectid/issue/create">
                <CreateIssuePage />
              </Route>
              {/* <Redirect from="/" exact to="/dashboard" /> */}
            </UserContext.Provider>
          </Switch>
        </AlertMessage>
      </HeaderLayout>
    </Router>
  );
}

export default App;
