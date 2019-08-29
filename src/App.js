import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/busniess/Login'
import Home from './components/busniess/Home'
import Register from './components/busniess/Register'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path='/' component={Login}></Route>
        <Route  path='/login' component={Login}></Route>
        <Route  path='/register' component={Register}></Route>
        <Route  path='/home' component={Home}></Route>
        
      </Router>
    </div>
  );
}

export default App;
