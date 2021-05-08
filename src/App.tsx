import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import EventDetail from './pages/event/id';
import Index from './pages/index';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Index />
        </Route>
        <Route exact path="/event/:id">
          <EventDetail />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
