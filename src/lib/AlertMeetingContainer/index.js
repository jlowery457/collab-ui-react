import React from 'react';
import PropTypes from 'prop-types';
import { AlertMeeting } from '@collab-ui/react';

const AlertMeetingContainer = props => {
  const {alertList} = props;

  return (
    <div className='cui-alert__container cui-alert__container--bottom-right'>
      {alertList}
    </div>
  );
}

AlertMeetingContainer.defaultProps = {
  alertList: []
}

AlertMeetingContainer.propTypes = {
  /**
   * Array of AlertMeeting components
   */
  alertList: PropTypes.arrayOf(PropTypes.node)
}

AlertMeetingContainer.displayName = 'AlertMeetingContainer';

export default AlertMeetingContainer;
