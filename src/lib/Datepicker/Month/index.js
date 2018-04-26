import React from 'react';
import PropTypes from 'prop-types';
import Week from '@collab-ui/react/Datepicker/Week';
import * as utils from '@collab-ui/react/Datepicker/date_utils';

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6;

export default class Month extends React.Component {
  static displayName = 'Month';

  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event);
    }
  };

  isWeekInMonth = startOfWeek => {
    const day = this.props.day;
    const endOfWeek = utils.addDays(utils.cloneDate(startOfWeek), 6);
    return (
      utils.isSameMonth(startOfWeek, day) || utils.isSameMonth(endOfWeek, day)
    );
  };

  renderWeeks = () => {
    const weeks = [];
    const isFixedHeight = this.props.fixedHeight;
    let currentWeekStart = utils.getStartOfWeek(
      utils.getStartOfMonth(utils.cloneDate(this.props.day))
    );
    let i = 0;
    let breakAfterNextPush = false;

    while (true) {
      weeks.push(
        <Week
          key={i}
          day={currentWeekStart}
          excludeDates={this.props.excludeDates}
          filterDate={this.props.filterDate}
          includeDates={this.props.includeDates}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          month={utils.getMonth(this.props.day)}
          onDayClick={this.handleDayClick}
          preSelection={this.props.preSelection}
          selected={this.props.selected}
        />
      );

      if (breakAfterNextPush) {
        break;
      } 

      i++;
      currentWeekStart = utils.addWeeks(utils.cloneDate(currentWeekStart), 1);

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek =
        isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT;
      const isNonFixedAndOutOfMonth =
        !isFixedHeight && !this.isWeekInMonth(currentWeekStart);

      if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
        if (this.props.peekNextMonth) {
          breakAfterNextPush = true;
        } else {
          break;
        }
      }
    }

    return weeks;
  };


  render() {
    return (
      <div
        className='cui-datepicker__month'
        onMouseLeave={this.handleMouseLeave}
        // role="listbox"
      >
        {this.renderWeeks()}
      </div>
    );
  }
}

Month.propTypes = {
  day: PropTypes.object.isRequired,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  fixedHeight: PropTypes.bool,
  includeDates: PropTypes.array,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  onDayClick: PropTypes.func,
  peekNextMonth: PropTypes.bool,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
};
