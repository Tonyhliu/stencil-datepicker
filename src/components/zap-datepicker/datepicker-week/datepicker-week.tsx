import {
  Component,
  Prop,
  State
} from '@stencil/core';

@Component({
  tag: 'datepicker-week',
  styleUrl: 'datepicker-week.scss'
})
export class DatepickerWeek {
  _sayDay() {
    console.log(this);
  }

  render() {
    const days = {
      'Sunday': 'Su',
      'Monday': 'Mo',
      'Tuesday': 'Tu',
      'Wednesday': 'We',
      'Thursday': 'Th',
      'Friday': 'Fr',
      'Saturday': 'Sa',
    };

    return (
      <div>
        <div>
          {
            Object.keys(days).map(day => {
              return (
                <p class='datepicker-week-test' onClick={this._sayDay}>{days[day]}</p>
              )
            })
          }
        </div>
      </div>
    );
  }
}
