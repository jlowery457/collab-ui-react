import React from 'react';
import PropTypes from 'prop-types';

export default class DatepickerPopover extends React.PureComponent {
  static displayName = 'DatepickerPopover';

  render() {
    const { children } = this.props;

    return (
      /* eslint-disable */
      // Disabled due to onClick on div - needed to not close Popover Prematurely
      <div
        className={'cui-datepicker__popover-container'}
        onClick={e => e.stopPropagation()}>
        <div className={'cui-datepicker__popover'}>
          <div className="inline-flex">{children}</div>
        </div>
      </div>
      /* eslint-enable */
    );
  }
}

DatepickerPopover.defaultProps = {
  children: null,
};

DatepickerPopover.propTypes = {
  /** Child component to display within Popover */
  children: PropTypes.node,
};
