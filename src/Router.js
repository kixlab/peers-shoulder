import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import KixTube from './prototypes/kixtube/KixTube';
import Chart from './prototypes/kixtube/Chart';

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/chart" component={Chart}/> 
          <Route path="" component={KixTube}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
