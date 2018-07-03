import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AreaClass from '../lib/Area';
import { areaNames } from '../lib/lib';
import { Container, DropdownProps, Form } from 'semantic-ui-react';

interface Props extends RouteComponentProps<any> {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  area: string;
  recognition: SpeechRecognition;
}

class SpeechTest extends React.Component<Props, State> {
  state = {
    area: 'Cave of the Past',
    recognition: new SpeechRecognition()
  };

  componentDidMount() {
    const area: AreaClass = this.props.areas[this.state.area];
    const enemyNames: string = Object.keys(area.enemies)
      .reduce(
      (accumulator, name, index) => {
        const formattedName = `"${name.split(/(?=[A-Z])/).join(' ')}"`;
        if (index > 0) {
          return accumulator + ' | ' + formattedName;
        }
        return formattedName;
      },
      '');
    console.log(enemyNames);
    const grammar = '#JSGF V1.0; grammar enemy; public <enemy> = ' + enemyNames + ' ;';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 100);
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
      console.log(event.results);
    };
    console.log(speechRecognitionList[0].src);
    console.log(speechRecognitionList[0].weight);
    this.setState(prevState => ({ ...prevState, recognition }));
  }

  handleAreaChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ area: data.value as string });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: URLSearchParams = new URLSearchParams();
    Object.keys(this.state).forEach((key) => {
      params.append(key, this.state[key]);
    });
    this.props.history.push(`/encounters/result?${params.toString()}`);
  }

  render() {
    return (
      <Container textAlign="center">
        <Form onSubmit={this.handleSubmit}>
          <Form.Dropdown
            label="Areas"
            placeholder="Area"
            options={areaNames.map((name) => { return { key: name, value: name, text: name }; })}
            value={this.state.area}
            onChange={this.handleAreaChange}
            search={true}
            selection={true}
          />
          <Form.Button
            type="button"
            content="Start Recognition"
            primary={true}
            onClick={() => this.state.recognition.start()}
          />
          <Form.Button type="submit" content="Generate Encounters" primary={true}/>
        </Form>
      </Container>
    );
  }
}

export default withRouter(SpeechTest);
