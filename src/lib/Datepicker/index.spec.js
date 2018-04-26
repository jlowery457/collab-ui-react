import React from 'react';
import { mount } from 'enzyme';
import DatePicker from '../Datepicker';
import Calendar from '../Datepicker/Calendar';
import Input from '@collab-ui/react/Input';

describe('tests for <DatePicker />', () => {

  function mountDatePicker(extraProps) {
    return mount(
      <DatePicker
        onChange={() => {}}
        {...extraProps}
      />
    );
  }

  it("should show the calendar when focusing on the date input", () => {
    const datePicker = mountDatePicker();
    const input = datePicker.find(Input);
    input.simulate('mouseDown');
    const calendar = datePicker.find(Calendar);
    expect(datePicker.find(calendar).length).toEqual(1);
  });
});
