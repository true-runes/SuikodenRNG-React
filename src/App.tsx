import * as React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Sequence from './Sequence';
import Encounters from './Encounters';
import ItemDrops from './ItemDrops';
import RNGFinder from './RNGFinder';
import RunAssistant from './RunAssistant';
import { enemies } from './lib/enemies';
import { initAreas } from './lib/lib';
import { Route } from 'react-router-dom';
import './index.css';

class App extends React.Component {
  state = {
    areas: initAreas(enemies)
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
        <Navbar/>
        <Route path="/" component={Home} exact={true}/>
        <Route
          path="/encounters"
          render={() => (
            <Encounters areas={this.state.areas}/>
          )}
        />
        <Route path="/sequence" component={Sequence}/>
        <Route
          path="/drops"
          render={() => (
            <ItemDrops areas={this.state.areas}/>
          )}
        />
        <Route
          path="/rngfinder"
          render={() => (
            <RNGFinder areas={this.state.areas}/>
          )}
        />
        <Route
          path="/runassist"
          render={() => (
            <RunAssistant areas={this.state.areas}/>
          )}
        />
      </div>
    );
  }
}

export default App;
