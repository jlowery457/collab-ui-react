import React from 'react';
import { shallow, mount } from 'enzyme';
import Month from '../Month';
import Week from '@collab-ui/react/Datepicker/Week';
import Day from '@collab-ui/react/Datepicker/Day';
import * as utils from '@collab-ui/react/Datepicker/date_utils';
import moment from 'moment';
import range from 'lodash/range';

const TEST_DATE = '2018-04-01';

describe('tests for <Month />', () => {
  const day = moment(TEST_DATE);

  expect.extend({
    toBeSameDay(received, argument) {
      const pass = utils.isSameDay(received, argument);
      if (pass) {
        return { 
          message: () => 
            `expected ${received} not to be equal to ${argument}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be equal to ${argument}`,
          pass: false,
        };
      }
    }
  });

  function assertDateRangeInclusive(month, start, end) {
    const dayCount = utils.getDaysDiff(end, start) + 1;
    const days = month.find(Day);
    expect(days).toHaveLength(dayCount);
    range(0, dayCount).forEach(offset => {
      const day = days.get(offset);
      const expectedDay = utils.addDays(utils.cloneDate(start), offset);
      expect(day.props.day).toBeSameDay(expectedDay);
    });
  }

  it('should match month SnapShot', () => {
    const container = shallow(
      <Month day={day} month={3} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render 5 Week Components', () => {
    const container = shallow(
      <Month day={day} month={3} />
    );

    expect(container.find(Week)).toHaveLength(5);
  });

  it('should render all days of the month and some days in neighboring months', () => {
    assertDateRangeInclusive(
      mount(<Month day={day} />),
      utils.getStartOfWeek(utils.cloneDate(day)),
      utils.getEndOfWeek(utils.getEndOfMonth(utils.cloneDate(day)))
    );
  });

  it('should handle day click event', () => {
    let count = 0;
    const container = mount(
      <Month day={day} month={3} onDayClick={() => count++} />
    );

    container.find(Day).first().find('div.cui-datepicker__day').simulate('click');
    expect(count).toEqual(1);
  });

});
