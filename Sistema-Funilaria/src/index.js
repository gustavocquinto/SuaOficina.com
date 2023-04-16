// Libs
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

// Styles
import './assets/styles/index.css';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Budget from './pages/Budget/Budget';
import Services from './pages/Services/Services';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import DashBudget from './pages/Dashboard/DashBudget'
import DashAllBugdets from './pages/Dashboard/DashAllBudget';
import DashAllUsers from './pages/Dashboard/DashAllUsers/DashAllUsers';
import dashbudget2 from './pages/Dashboard/DashBudget2';

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route path="/budgets/:id" component={Budget} />
        <Route path="/services" component={Services} />
        <Route exact path="/profile" component={Profile} />
        <Route  path="/dashbudget/:id" component={DashBudget} />
        <Route exact path="/dashallbudget" component={DashAllBugdets} />
        <Route exact path="/dashallusers" component={DashAllUsers} />
        <Route exact path="/notfound" component={NotFound} />
        <Route exact path="/dashbudget2/:id" component={dashbudget2} />
        <Redirect to="/notfound" />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));