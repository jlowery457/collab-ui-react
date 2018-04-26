import React from 'react';
// import ErrorBoundary from '@collab-ui/react/ErrorBoundary';
// import ErrorContainer from '../ErrorContainer';
import { DatePicker } from '@collab-ui/react';
// import moment from 'moment';

// Import Method Show Below
// import { Button } from '@collab-ui/react';

// export default class PlaygroundComponent extends React.Component {
//   render() {
//     return (
//       <ErrorBoundary fallbackComponent={<ErrorContainer />}>
//         <div />
//       </ErrorBoundary>
//     );
//   }
// }

// Sample Class Method Show Below
export default class PlaygroundComponent extends React.Component {

  state = {
    startDate: null
  };

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  render() {
    return (
      <div>
        <DatePicker
          // label='Pick a Date'
          // locale='en-GB'
          // disabled
          // inputSize='small-3'
          placeholder='Pick a Date'
          selected={this.state.startDate}
          onChange={this.handleChange}
          // minDate={moment()}
          // maxDate={moment()}
          />
      </div>
    );
  }
}

