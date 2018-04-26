import React from 'react';
import { shallow } from 'enzyme';
import Day from '../Day';
import moment from 'moment';

const TEST_DATE = '2018-04-01';

describe('tests for <Day />', () => {
  const day = moment(TEST_DATE);
  it('should match day SnapShot', () => {
    const container = shallow(
      <Day day={day} month={3} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should match selected day SnapShot', () => {
    const selected = moment(TEST_DATE);
    const container = shallow(
      <Day day={day} month={3} selected={selected} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render a div', () => {
    const container = shallow(
      <Day day={day} month={3} />
    );
    expect(container.find('div.cui-datepicker__day-container')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day')).toHaveLength(1);
  });

  it('should render a div styled properly when day is selected', () => {
    const selected = moment(TEST_DATE);
    const container = shallow(
      <Day day={day} month={3} selected={selected} />
    );
    expect(container.find('div.cui-datepicker__day-container')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day--selected')).toHaveLength(1);
  });

  it('should render a div styled properly when day is disabled', () => {
    const maxDate = moment('2018-03-01');
    const container = shallow(
      <Day day={day} month={3} maxDate={maxDate} />
    );
    expect(container.find('div.cui-datepicker__day-container')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day--disabled')).toHaveLength(1);
  });

  it('should render a div styled properly when day is outside current month', () => {
    const container = shallow(
      <Day day={day} month={4} /> // month 4 is May
    );
    expect(container.find('div.cui-datepicker__day-container')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day')).toHaveLength(1);
    expect(container.find('div.cui-datepicker__day--outside-month')).toHaveLength(1);
  });

  it('should render a div with the proper day', () => {
    const container = shallow(
      <Day day={day} month={3} /> // month 4 is May
    );
    expect(container.find('div.cui-datepicker__day').text()).toEqual('1');
  });

  it('should handle day click event', () => {
    let count = 0;
    const container = shallow(
      <Day day={day} month={3} onClick={() => count++}/>
    );

    container.find('div.cui-datepicker__day').simulate('click');
    expect(count).toEqual(1);
  });

  it('should handle day mouse enter event', () => {
    let count = 0;
    const container = shallow(
      <Day day={day} month={3} onMouseEnter={() => count++}/>
    );

    container.find('div.cui-datepicker__day').simulate('mouseenter');
    expect(count).toEqual(1);
  });
});