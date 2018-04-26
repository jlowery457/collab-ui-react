import React from 'react';
import { shallow } from 'enzyme';
import Week from '../Week';
import Day from '@collab-ui/react/Datepicker/Day';
import moment from 'moment';

const TEST_DATE = '2018-04-01';

describe('tests for <Week />', () => {
  const day = moment(TEST_DATE);
  it('should match week SnapShot', () => {
    const container = shallow(
      <Week day={day} month={3} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render a div', () => {
    const container = shallow(
      <Week day={day} month={3} />
    );
    expect(container.find('div').hasClass('cui-datepicker__week')).toEqual(true);
  });

  it('should render 7 Day components', () => {
    const container = shallow(
      <Week day={day} month={3} />
    );

    expect(container.find(Day)).toHaveLength(7);
  });

  it('should handle day click event', () => {
    let count = 0;
    const container = shallow(
      <Week day={day} month={3} onDayClick={() => count++}/>
    );

    container.find(Day).first().simulate('click');
    expect(count).toEqual(1);
  });

  it('should handle day mouse enter event', () => {
    let count = 0;
    const container = shallow(
      <Week day={day} month={3} onDayMouseEnter={() => count++}/>
    );

    container.find(Day).first().simulate('mouseenter');
    expect(count).toEqual(1);
  });
});