import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Myflow from './prototypes/myflow/Myflow';
import Behaviours from './prototypes/behaviours/Behaviours';
import AnalysisUser from './prototypes/analysis/AnalysisUser';
import AnalysisVideo from './prototypes/analysis/AnalysisVideo';
import KixTube from './prototypes/kixtube/KixTube';

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/myflow" component={Myflow}/> 
          <Route path="/behaviours/:user" component={Behaviours}/>
          <Route path="/behaviours" component={Behaviours}/>
          <Route path="/analysis/users/:user" component={AnalysisUser}/>
          <Route path="/analysis/users" component={AnalysisUser}/>
          <Route path="/analysis/video/:video" component={AnalysisVideo}/>
          <Route path="/analysis/video" component={AnalysisVideo}/>
          <Route path="/kixtube" component={KixTube}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
