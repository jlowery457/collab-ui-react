/**
 * @category controls
 * @component date-picker
 * @variations collab-ui-react
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '@collab-ui/react/Icon';
import Input from '@collab-ui/react/Input';
import DatepickerPopover from '@collab-ui/react/Datepicker/DatepickerPopover';
import Calendar from '@collab-ui/react/Datepicker/Calendar';
import EventOverlay from '@collab-ui/react/EventOverlay';
import * as utils from '@collab-ui/react/Datepicker/date_utils';

export default class DatePicker extends React.Component {
  static displayName = 'DatePicker';

  constructor(props) {
    super(props);
    this.state = this.calcInitialState();
  }

  componentWillReceiveProps(nextProps) {
    const currentMonth = this.props.selected && utils.getMonth(this.props.selected);
    const nextMonth = nextProps.selected && utils.getMonth(nextProps.selected);
    if (currentMonth !== nextMonth) {
      this.setPreSelection(nextProps.selected);
    }
  }

  calcInitialState = () => {
    const defaultPreSelection = utils.now();
    const minDate = utils.getEffectiveMinDate(this.props);
    const maxDate = utils.getEffectiveMaxDate(this.props);
    const boundedPreSelection =
      minDate && utils.isBefore(defaultPreSelection, minDate)
        ? minDate
        : maxDate && utils.isAfter(defaultPreSelection, maxDate)
          ? maxDate
          : defaultPreSelection;
    return {
      activeIndex: null,
      anchorNode: null,
      anchorWidth: null,
      isOpen: false,
      preSelection: this.props.selected
        ? utils.newDate(this.props.selected)
        : boundedPreSelection,
      visibleProp: 'bottom-center',
    };
  };

  choosePosition = () => {
    this.state.isOpen
      && this.isVisible(ReactDOM.findDOMNode(this.calendar), this.state.anchorNode);
  };

  setOpen = open => {
    this.setState({
      isOpen: open,
      preSelection:
        open && this.state.isOpen
          ? this.state.preSelection
          : this.calcInitialState().preSelection,
      anchorNode:
        open
          ? ReactDOM.findDOMNode(this.clickTextField).parentNode
          : null
    }, () => {
      if (open) {
        this.choosePosition();
      }
    });
  };

  isVisible = (element, elementAnchor) => {
    let tempParentArr = [];
    const anchor = elementAnchor && elementAnchor.getBoundingClientRect();
    const elementBoundingRect = element.getBoundingClientRect();
    const elementParent = element.parentElement;
    const windowBottom = window.pageXOffset + window.innerHeight;
    const elementHeight = elementBoundingRect.height;
    const anchorWidth = anchor.width;
    const anchorBottom = anchor.bottom;
    const totalHeight = anchorBottom + elementHeight;

    const findParents = elem => {
      return !elem.parentElement
        ? tempParentArr
        : findParents(elem.parentElement, tempParentArr.push(elem));
    };

    const elementParents = findParents(elementParent);

    const findOverflow = node => {
      const searchProps = ['overflow', 'overflow-y'];

      return searchProps.reduce((agg, prop) => {
        let overflowElement = ReactDOM.findDOMNode(node).style[prop];

        return !overflowElement || agg.includes(overflowElement)
          ? agg
          : (agg += overflowElement);
      }, '');
    };

    const findScrollParent = () => {
      let overflowElement = null;
      let idx = 0;

      while (!overflowElement && elementParents[idx]) {
        if (/(auto|scroll)/.test(findOverflow(elementParents[idx]))) {
          return (overflowElement = elementParents[idx]);
        }
        idx++;
      }

      return overflowElement ? overflowElement : window;
    };

    const scrollParent = findScrollParent(element);
    const parentBottom =
      (!!scrollParent.getBoundingClientRect &&
        scrollParent.getBoundingClientRect().bottom) ||
      windowBottom;

    return (
      (totalHeight < parentBottom && totalHeight < windowBottom)
        ? this.setState({ visibleProp: 'bottom-center', anchorWidth })
        : this.setState({ visibleProp: 'top-center', anchorWidth })
    );
  };

  // onFocus = () => {
  //   this.setState({
  //     isOpen: true,
  //     anchorNode: ReactDOM.findDOMNode(this.clickTextField).parentNode
  //   });
  // };

  onMouseDown = () => {
    if (!this.props.disabled) {
      this.setOpen(true);
    }
  };

  onOverlayClose = () => {
    this.setOpen(false);
  }

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
    const date = utils.parseDate(event.target.value, this.props);
    if (date || !event.target.value) {
      this.setSelected(date, event, true);
    }
  };

  handleSelect = (date, event) => {
    this.setSelected(date, event);
    if (!this.props.shouldCloseOnSelect) {
      this.setPreSelection(date);
    } else {
      this.setOpen(false);
    }
  };

  setSelected = (date, event, keepInput) => {
    let changedDate = date;

    if (changedDate !== null && utils.isDayDisabled(changedDate, this.props)) {
      return;
    }

    if (
      !utils.isSameDay(this.props.selected, changedDate) ||
      this.props.allowSameDay
    ) {
      if (changedDate !== null) {
        if (this.props.selected) {
          let selected = this.props.selected;
          if (keepInput) {
            selected = utils.newDate(changedDate);
          }
          changedDate = utils.setTime(utils.newDate(changedDate), {
            hour: utils.getHour(selected),
            minute: utils.getMinute(selected),
            second: utils.getSecond(selected)
          });
        }
        this.setState({
          preSelection: changedDate
        });
      }
      this.props.onChange(changedDate, event);
    }

    this.props.onSelect(changedDate, event);

    if (!keepInput) {
      this.setState({ inputValue: null });
    }
  };

  setPreSelection = date => {
    const isDateRangePresent =
      typeof this.props.minDate !== 'undefined' &&
      typeof this.props.maxDate !== 'undefined';
    const isValidDateSelection =
      isDateRangePresent && date
        ? utils.isDayInRange(date, this.props.minDate, this.props.maxDate)
        : true;
    if (isValidDateSelection) {
      this.setState({
        preSelection: date
      });
    }
  };

  onInputClick = () => {
    if (!this.props.disabled) {
      this.setOpen(true);
    }
  };

  onInputKeyDown = event => {
    this.props.onKeyDown(event);
    const eventKey = event.key;
    if (!this.state.isOpen) {
      if (eventKey !== 'Enter' && eventKey !== 'Escape' && eventKey !== 'Tab') {
        this.onInputClick();
      }
      return;
    }
    const copy = utils.newDate(this.state.preSelection);
    if (eventKey === 'Enter') {
      event.preventDefault();
      if (
        utils.isMoment(this.state.preSelection) ||
        utils.isDate(this.state.preSelection)
      ) {
        this.handleSelect(copy, event);
        !this.props.shouldCloseOnSelect && this.setPreSelection(copy);
      } else {
        this.setOpen(false);
      }
    } else if (eventKey === 'Escape') {
      event.preventDefault();
      this.setOpen(false);
    } else if (eventKey === 'Tab') {
      this.setOpen(false);
    } else {
      let newSelection;
      switch (eventKey) {
        case 'ArrowLeft':
          event.preventDefault();
          newSelection = utils.subtractDays(copy, 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          newSelection = utils.addDays(copy, 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          newSelection = utils.subtractWeeks(copy, 1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          newSelection = utils.addWeeks(copy, 1);
          break;
        case 'PageUp':
          event.preventDefault();
          newSelection = utils.subtractMonths(copy, 1);
          break;
        case 'PageDown':
          event.preventDefault();
          newSelection = utils.addMonths(copy, 1);
          break;
        case 'Home':
          event.preventDefault();
          newSelection = utils.subtractYears(copy, 1);
          break;
        case 'End':
          event.preventDefault();
          newSelection = utils.addYears(copy, 1);
          break;
      }
      // if (this.props.adjustDateOnChange) {
      //   this.setSelected(newSelection);
      // }
      this.setPreSelection(newSelection);
    }
  }

  renderCalendar = () => {
    return (
      <Calendar
        dateFormat={this.props.dateFormatCalendar}
        excludeDates={this.props.excludeDates}
        filterDate={this.props.filterDate}
        includeDates={this.props.includeDates}
        locale={this.props.locale}
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        onMonthChange={this.props.onMonthChange}
        onSelect={this.handleSelect}
        preSelection={this.state.preSelection}
        selected={this.props.selected}
      />
    );
  }

  renderInput = () => {
    const inputValue =
      typeof this.props.value === 'string'
        ? this.props.value
        : typeof this.state.inputValue === 'string'
          ? this.state.inputValue
          : utils.safeDateFormat(this.props.selected, this.props);

    return (
      <Input
        disabled={this.props.disabled}
        htmlId={`${this.props.htmlId}-input`}
        inputRef={ref => (this.clickTextField = ref)}
        inputSize={this.props.inputSize}
        label={this.props.label}
        name={`${this.props.name}-input`}
        onChange={this.handleChange}
        onClick={this.onInputClick}
        onKeyDown={this.onInputKeyDown}
        onMouseDown={this.onMouseDown}
        ref={ref => this.calendar = ref}
        // onFocus={this.onFocus}
        placeholder={this.props.placeholder}
        value={inputValue}
      >
        <Icon name='calendar-month_20' isAria={false} />
      </Input>
    );
  }

  render() {
    const calendar = this.renderCalendar();
    this.input = this.renderInput();

    const popoverElement = (
      <EventOverlay
        allowClickAway
        anchorNode={this.state.anchorNode}
        close={this.onOverlayClose}
        direction={this.state.visibleProp}
        isOpen={this.state.isOpen}>
        <DatepickerPopover>
          {calendar}
        </DatepickerPopover>
      </EventOverlay>
    );

    return (
      <div className='cui-datepicker-container'>
        {this.input}
        {popoverElement}
      </div>
    );
  }
}

DatePicker.propTypes = {
  allowSameDay: PropTypes.bool,
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  dateFormatCalendar: PropTypes.string,
  disabled: PropTypes.bool,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  htmlId: PropTypes.string,
  includeDates: PropTypes.array,
  inputSize: PropTypes.string,
  label: PropTypes.string,
  locale: PropTypes.string,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  onMonthChange: PropTypes.func,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
  shouldCloseOnSelect: PropTypes.bool,
  value: PropTypes.string,
};

DatePicker.defaultProps = {
  allowSameDay: false,
  dateFormat: 'L',
  dateFormatCalendar: 'MMMM YYYY',
  onChange() {},
  onKeyDown() {},
  onMonthChange() {},
  onSelect() {},
  shouldCloseOnSelect: true,
};
