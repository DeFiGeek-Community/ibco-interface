import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Web3ReactManager from './components/Web3ReactManager';
import EventEditorCreate from './pages/event-editor/create';
import EventDetail from './pages/event/id';
import Index from './pages/index';

function App() {
  return (
    <Web3ReactManager>
      <Switch>
        <Route exact path="/">
          <Index />
        </Route>
        <Route exact path="/event/:id">
          <EventDetail />
        </Route>
        <Route exact path="/event-editor/create">
          <EventEditorCreate />
        </Route>
      </Switch>
    </Web3ReactManager>
  );
}

export default App;
