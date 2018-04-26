import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as utils from '@collab-ui/react/Datepicker/date_utils';

export default class Day extends React.Component {
  static displayName = 'Day';

  handleClick = event => {
    if (!this.isDisabled() && this.props.onClick) {
      this.props.onClick(event);
    }
  };

  handleKeyPress = e => {
    const { onClick } = this.props;
    e.preventDefault();
    if (e.which === 32 || e.which === 13) {
      return onClick(e);
    } else if (e.charCode === 32 || e.charCode === 13) {
      return onClick(e);
    }
  };

  handleMouseEnter = event => {
    if (!this.isDisabled() && this.props.onMouseEnter) {
      this.props.onMouseEnter(event);
    }
  };

  isSameDay = other => utils.isSameDay(this.props.day, other);

  isDisabled = () => utils.isDayDisabled(this.props.day, this.props);

  isOutsideMonth = () => {
    return (
      this.props.month !== undefined &&
      this.props.month !== utils.getMonth(this.props.day)
    );
  };

  isKeyboardSelected = () =>
    !this.isSameDay(this.props.selected) &&
    this.isSameDay(this.props.preSelection);

  getClassNames = () => {
    return classnames(
      'cui-datepicker__day',

      {
        'cui-datepicker__day--disabled': this.isDisabled(),
        'cui-datepicker__day--selected': this.isSameDay(this.props.selected),
        'cui-datepicker__day--keyboard-selected': this.isKeyboardSelected() && !this.isSameDay(utils.newDate()),
        'cui-datepicker__day--today': this.isSameDay(utils.newDate()) && !this.props.selected,
        'cui-datepicker__day--today--not-selected': this.props.selected && this.isSameDay(utils.newDate()) && !this.isSameDay(this.props.selected),
        'cui-datepicker__day--outside-month': this.isOutsideMonth()
      }
    );
  };

  render() {
    return (
      <div className='cui-datepicker__day-container'>
        <div
          className={this.getClassNames()}
          onClick={this.handleClick}
          onKeyPress={this.handleKeyPress}
          onMouseEnter={this.handleMouseEnter}
          aria-label={`day-${utils.getDate(this.props.day)}`}
          aria-selected={this.isSameDay(this.props.selected)}
          tabIndex='0' //TODO: (jlowery) not sure what to do with this.
          role='option'
        >
          {utils.getDate(this.props.day)}
        </div>
      </div>
    );
  }
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  month: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
};