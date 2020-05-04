import React from 'react';
// import logo from './logo.svg';
import './App.css';
import MainPage from './components/MainPage';
import ProjectPage from './components/ProjectPage';
import { Navbar, NavbarBrand } from 'reactstrap';
import UserContext from './components/UserContext';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

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



// creating a global context for the currently authenticated user 


function App() {
  return (
    <Router>
      <HeaderLayout>
        <Switch>
          <UserContext.Provider value={{ userid: 1 }}>
            <Route path="/dashboard">
              <MainPage userid="1" />
            </Route>
            <Route path="/project/:projectid">
              <ProjectPage />
            </Route>
            <Redirect from="/" exact to="/dashboard" />
          </UserContext.Provider>
        </Switch>
      </HeaderLayout>
    </Router>
  );
}

export default App;
