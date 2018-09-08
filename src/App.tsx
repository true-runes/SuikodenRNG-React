import * as React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import EncountersForm from './Encounters';
import EncounterResult from './Encounters/Result';
import SequenceForm from './Sequence';
import SequenceResult from './Sequence/Result';
import NPCForm from './NPCMovementCalculator/';
import NPCResult from './NPCMovementCalculator/Result';
import ItemDropsForm from './ItemDrops';
import ItemDropsResult from './ItemDrops/Result';
import RNGFinder from './RNGFinder';
import RunAssistantForm from './RunAssistant';
import RunAssistantResult from './RunAssistant/RunAssistantTool';
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
          exact={true}
          render={() => (
            <EncountersForm areas={this.state.areas}/>
          )}
        />
        <Route
          path="/encounters/result"
          exact={true}
          render={() => (
            <EncounterResult areas={this.state.areas}/>
          )}
        />
        <Route
          path="/sequence"
          exact={true}
          component={SequenceForm}
        />
        <Route
          path="/sequence/result"
          exact={true}
          component={SequenceResult}
        />
        <Route
          path="/npc"
          exact={true}
          component={NPCForm}
        />
        <Route
          path="/npc/result"
          exact={true}
          component={NPCResult}
        />
        <Route
          path="/drops"
          exact={true}
          render={() => (
            <ItemDropsForm areas={this.state.areas}/>
          )}
        />
        <Route
          path="/drops/result"
          exact={true}
          render={() => (
            <ItemDropsResult areas={this.state.areas}/>
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
          exact={true}
          render={() => (
            <RunAssistantForm areas={this.state.areas}/>
          )}
        />
        <Route
          path="/runassist/result"
          exact={true}
          render={() => (
            <RunAssistantResult areas={this.state.areas}/>
          )}
        />
      </div>
    );
  }
}

export default App;
