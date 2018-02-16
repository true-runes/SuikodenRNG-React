import * as React from 'react';
import { Button, Container, Progress, Segment } from 'semantic-ui-react';
import { FindRNGStatus as Status } from '../lib/interfaces';
import { numToHexString } from '../lib/lib';

interface Props extends Status {
  cancel: (event: React.FormEvent<HTMLButtonElement>) => any;
  running: boolean;
}

export default class RNGFinderStatus extends React.Component<Props, {}> {
  render() {
    const { message, progress, done, result, running } = this.props;
    return (
      <Container textAlign="center">
        {this.props.result &&
          <Segment>
            {numToHexString(result!)}
          </Segment>
        }
        <Progress
          percent={done ? 100 : progress}
          progress={true}
          indicating={true}
          label={message}
        />
        <Button
          type="button"
          onClick={this.props.cancel}
          content="Terminate"
          negative={true}
          disabled={!running}
        />
      </Container>
    );
  }
}
