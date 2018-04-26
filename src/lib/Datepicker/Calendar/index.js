import React from 'react';
import PropTypes from 'prop-types';
import Month from '@collab-ui/react/Datepicker/Month';
import Button from '@collab-ui/react/Button';
import Icon from '@collab-ui/react/Icon';

import * as utils from '@collab-ui/react/Datepicker/date_utils';

export default class Calendar extends React.Component {
  static displayName = 'Calendar';

  constructor(props) {
    super(props);
    this.state = {
      date: this.localizeDate(this.getDateInView()),
      selectingDate: null,
      monthContainer: this.monthContainer
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.preSelection &&
      !utils.isSameDay(nextProps.preSelection, this.props.preSelection)
    ) {
      this.setState({
        date: this.localizeDate(nextProps.preSelection)
      });
    }
  }

  handleDayClick = (day, event) => this.props.onSelect(day, event);

  renderMonths = () => {
    const monthDate = utils.addMonths(utils.cloneDate(this.state.date));
    return (
      <div className='cui-datepicker__month-container'>
        <div className='cui-datepicker__header'>
          <div className='cui-datepicker__navigation'>
            {this.renderCurrentMonth(monthDate)}
            <div className='cui-datepicker__navigation--buttons'>
              {this.renderPreviousMonthButton()}
              {this.renderNextMonthButton()}
            </div>
          </div>
          <div className='cui-datepicker__day--names'>
            {this.header(monthDate)}
          </div>
        </div>
        <Month
          day={monthDate}
          excludeDates={this.props.excludeDates}
          filterDate={this.props.filterDate}
          includeDates={this.props.includeDates}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          onDayClick={this.handleDayClick}
          preSelection={this.props.preSelection}
          selected={this.props.selected}
        />
      </div>
    );
  }

  header = (date = this.state.date) => {
    const startOfWeek = utils.getStartOfWeek(utils.cloneDate(date));
    const dayNames = [];
    return dayNames.concat(
      [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const day = utils.addDays(utils.cloneDate(startOfWeek), offset);
        const localeData = utils.getLocaleData(day);
        const weekDayName = utils.getWeekdayMinInLocale(localeData, day);
        return (
          <div key={offset} className='cui-datepicker__day--name'>
            {weekDayName}
          </div>
        );
      })
    );
  };

  renderPreviousMonthButton = () => {
    const allPrevDaysDisabled = utils.allDaysDisabledBefore(
      this.state.date,
      'month',
      this.props
    );

    return (
      <Button
        color='none'
        className='cui-datepicker__navigation--buttons--previous'
        disabled={allPrevDaysDisabled}
        onClick={this.decreaseMonth}
        children={<Icon name='arrow-left_16' />}
      />
    );
  }

  renderNextMonthButton = () => {
    const allNextDaysDisabled = utils.allDaysDisabledAfter(
      this.state.date,
      'month',
      this.props
    );

    return (
      <Button
        color='none'
        className='cui-datepicker__navigation--buttons--next'
        disabled={allNextDaysDisabled}
        onClick={this.increaseMonth}
        children={<Icon name='arrow-right_16' />}
      />
    );
  }

  renderCurrentMonth = (date = this.state.date) => {
    return (
      <div className='cui-datepicker__navigation--current-month'>
        {utils.formatDate(date, this.props.dateFormat)}
      </div>
    );
  }

  getDateInView = () => {
    const { preSelection, selected } = this.props;
    const minDate = utils.getEffectiveMinDate(this.props);
    const maxDate = utils.getEffectiveMaxDate(this.props);
    const current = utils.now();
    const initialDate = selected || preSelection;
    if (initialDate) {
      return initialDate;
    } else {
      if (minDate && utils.isBefore(current, minDate)) {
        return minDate;
      } else if (maxDate && utils.isAfter(current, maxDate)) {
        return maxDate;
      }
    }
    return current;
  };

  localizeDate = date => utils.localizeDate(date, this.props.locale);

  increaseMonth = () => {
    this.setState(
      {
        date: utils.addMonths(utils.cloneDate(this.state.date), 1)
      },
      () => this.handleMonthChange(this.state.date)
    );
  };

  decreaseMonth = () => {
    this.setState(
      {
        date: utils.subtractMonths(utils.cloneDate(this.state.date), 1)
      },
      () => this.handleMonthChange(this.state.date)
    );
  };

  handleDayClick = (day, event) => this.props.onSelect(day, event);

  handleMonthChange = date => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(date);
    }
  };

  render() {
    return (
      <div>
        {this.renderMonths()}
      </div>
    );
  }
}

Calendar.propTypes = {
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  includeDates: PropTypes.array,
  locale: PropTypes.string,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  onMonthChange: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
};
