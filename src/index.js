import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
const hist = createBrowserHistory();
ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/" component={App} exact={true} />
      <Route path="/dashboard" component={Dashboard} exact={true} />
    </Switch>
  </Router>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
