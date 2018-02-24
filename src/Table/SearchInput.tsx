import * as React from 'react';
import { Button, Input } from 'semantic-ui-react';

interface Props {
  matches?: number[];
  search: (search: string) => any;
  next: (row: number) => any ;
}

const IndexComponent = (props: {numMatches: number, index: number, next: () => any }) => {
  return (
    <div>
      {props.numMatches > 0 ?
        <React.Fragment>
          {`${props.index + 1}/${props.numMatches}`}
          <Button
            content="Next"
            onClick={() => props.next()}
          />
        </React.Fragment> :
        '0/0'
      }
    </div>
  );
};

export default class SearchInputPresenter extends React.Component<Props, { index: number, search: string }> {
  state = {
    index: 0,
    search: ''
  };

  next = () => {
    this.setState({ index: ++this.state.index % this.props.matches!.length }, this.props.next(this.state.index));
  }

  render() {
    return (
      <React.Fragment>
        <Input
          label="Search"
          type="text"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            this.setState({ search: e.currentTarget.value, index: 0 }, this.props.search(this.state.search))
          }
          value={this.state.search}
        />
        {(this.props.matches && this.state.search !== '') &&
          <IndexComponent
            numMatches={this.props.matches.length}
            index={this.state.index}
            next={this.next}
          />
        }
      </React.Fragment>
    );
  }
}
