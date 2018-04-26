import React from 'react';
import PropTypes from 'prop-types';
import Day from '@collab-ui/react/Datepicker/Day';
import * as utils from '@collab-ui/react/Datepicker/date_utils';

export default class Week extends React.Component {
  static displayName = 'Week';

  handleDayClick = (day, event) => {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event);
    }
  };

  handleDayMouseEnter = day => {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day);
    }
  };

  renderDays = () => {
    const startOfWeek = utils.getStartOfWeek(utils.cloneDate(this.props.day));
    const days = [];

    return days.concat(
      [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const day = utils.addDays(utils.cloneDate(startOfWeek), offset);
        return (
          <Day
            key={offset}
            day={day}
            excludeDates={this.props.excludeDates}
            filterDate={this.props.filterDate}
            includeDates={this.props.includeDates}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            month={this.props.month}
            onClick={this.handleDayClick.bind(this, day)}
            onMouseEnter={this.handleDayMouseEnter.bind(this, day)}
            preSelection={this.props.preSelection}
            selected={this.props.selected}
          />
        );
      })
    );
  };

  render() {
    return <div className="cui-datepicker__week">{this.renderDays()}</div>;
  }
}

Week.propTypes = {
  day: PropTypes.object.isRequired,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  includeDates: PropTypes.array,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  month: PropTypes.number,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
};