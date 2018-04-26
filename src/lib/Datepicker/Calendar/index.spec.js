import React from 'react';
import { shallow, mount } from 'enzyme';
import Calendar from '../Calendar';
import * as utils from '@collab-ui/react/Datepicker/date_utils';

describe('tests for <Calendar />', () => {
  const dateFormat = 'MMMM YYYY';

  function getCalendar(extraProps) {
    return shallow(
      <Calendar
        dateFormat={dateFormat}
        onSelect={() => {}}
        {...extraProps}
      />
    );
  }

  function mountCalendar(extraProps) {
    return mount(
      <Calendar
        dateFormat={dateFormat}
        onSelect={() => {}}
        {...extraProps}
      />
    );
  }

  it('should start with the current date in view if no date is passed in', function() {
    const now = utils.newDate();
    const calendar = getCalendar();
    expect(utils.isSameDay(calendar.state().date, now)).toEqual(true);
  });

  it('should start with the selected date in view if provided', function() {
    const selected = utils.addYears(utils.newDate(), 1);
    const calendar = getCalendar({ selected });
    expect(utils.isSameDay(calendar.state().date, selected)).toEqual(true);
  });

  it('should start with the pre-selected date in view if provided', function() {
    const preSelected = utils.addYears(utils.newDate(), 2);
    const selected = utils.addYears(utils.newDate(), 1);
    const calendar = getCalendar({ preSelected, selected });
    expect(utils.isSameDay(calendar.state().date, selected)).toEqual(true);
  });

  it('should start with the min date in view if after the current date', function() {
    const minDate = utils.addYears(utils.newDate(), 1);
    const calendar = getCalendar({ minDate });
    expect(utils.isSameDay(calendar.state().date, minDate)).toEqual(true);
  });

  it('should start with the min include date in view if after the current date', function() {
    const minDate = utils.addYears(utils.newDate(), 1);
    const calendar = getCalendar({ includeDates: [minDate] });
    expect(utils.isSameDay(calendar.state().date, minDate)).toEqual(true);
  });

  it('should start with the max date in view if before the current date', function() {
    const maxDate = utils.subtractYears(utils.newDate(), 1);
    const calendar = getCalendar({ maxDate });
    expect(utils.isSameDay(calendar.state().date, maxDate)).toEqual(true);
  });

  it('should start with the max include date in view if before the current date', function() {
    const maxDate = utils.subtractYears(utils.newDate(), 1);
    const calendar = getCalendar({ includeDates: [maxDate] });
    expect(utils.isSameDay(calendar.state().date, maxDate)).toEqual(true);
  });

  it('should show disabled previous month navigation', function() {
    const calendar = getCalendar({
      minDate: utils.newDate(),
      maxDate: utils.addMonths(utils.newDate(), 3)
    });
    const prevNavigationButton = calendar.find(
      '.cui-datepicker__navigation--buttons--previous'
    );

    const nextNavigationButton = calendar.find(
      '.cui-datepicker__navigation--buttons--next'
    );
    expect(prevNavigationButton.props().disabled).toEqual(true);
    expect(nextNavigationButton.props().disabled).toBeFalsy();
  });

  it('should show disabled next month navigation', function() {
    const calendar = getCalendar({
      minDate: utils.subtractMonths(utils.newDate(), 3),
      maxDate: utils.newDate(),
    });
    const prevNavigationButton = calendar.find(
      '.cui-datepicker__navigation--buttons--previous'
    );

    const nextNavigationButton = calendar.find(
      '.cui-datepicker__navigation--buttons--next'
    );
    expect(prevNavigationButton.props().disabled).toBeFalsy();
    expect(nextNavigationButton.props().disabled).toEqual(true);
  });

  it('when clicking disabled month navigation, should not change month', function() {
    const onMonthChangeMock = jest.fn();
    const calendar = mountCalendar({
      minDate: utils.newDate(),
      maxDate: utils.newDate(),
      onMonthChange: onMonthChangeMock,
    });
    const prevNavigationButton = calendar.find(
      '[className="cui-datepicker__navigation--buttons--previous"]'
    );

    const nextNavigationButton = calendar.find(
      '[className="cui-datepicker__navigation--buttons--next"]'
    );

    prevNavigationButton.simulate('click');

    expect(onMonthChangeMock.mock.calls.length).toBe(0);

    nextNavigationButton.simulate('click');

    expect(onMonthChangeMock.mock.calls.length).toBe(0);
  });

  it('when clicking non-disabled month navigation, should change month', function() {
    const onMonthChangeMock = jest.fn();
    const calendar = mountCalendar({
      selected: utils.newDate(),
      minDate: utils.subtractMonths(utils.newDate(), 3),
      maxDate: utils.addMonths(utils.newDate(), 3),
      showDisabledMonthNavigation: true,
      onMonthChange: onMonthChangeMock
    });
    const prevNavigationButton = calendar.find(
      '[className="cui-datepicker__navigation--buttons--previous"]'
    );

    const nextNavigationButton = calendar.find(
      '[className="cui-datepicker__navigation--buttons--next"]'
    );

    prevNavigationButton.simulate('click');
    nextNavigationButton.simulate('click');

    expect(onMonthChangeMock.mock.calls.length).toBe(2);
  });

  describe('localization', function() {
    function testLocale(calendar, selected, locale) {
      const localized = utils.localizeDate(selected, locale);

      const calendarText = calendar.find('.cui-datepicker__navigation--current-month');
      expect(calendarText.text()).toEqual(
        utils.formatDate(localized, dateFormat)
      );

      const firstDateOfWeek = utils.getStartOfWeek(utils.cloneDate(localized));
      const firstWeekDayMin = utils.getWeekdayMinInLocale(
        utils.getLocaleData(firstDateOfWeek),
        firstDateOfWeek
      );
      const firstHeader = calendar.find('.cui-datepicker__day--name').at(0);
      expect(firstHeader.text()).toEqual(firstWeekDayMin);
    }

    it('should use the globally-defined locale by default', function() {
      const selected = utils.newDate();
      const calendar = getCalendar({ selected });
      testLocale(calendar, selected, utils.getDefaultLocale());
    });

    it('should use the locale specified as a prop', function() {
      const locale = 'fr';
      const selected = utils.localizeDate(utils.newDate(), locale);
      const calendar = getCalendar({ selected, locale });
      testLocale(calendar, selected, locale);
    });

    it('should override the locale of the date with the globally-defined locale', function() {
      const selected = utils.localizeDate(utils.newDate(), 'fr');
      const calendar = getCalendar({ selected });
      testLocale(calendar, selected, utils.getDefaultLocale());
    });

    it('should override the locale of the date with the locale prop', function() {
      const locale = 'fr';
      const selected = utils.newDate();
      const calendar = getCalendar({ selected, locale });
      testLocale(calendar, selected, locale);
    });
  });

});