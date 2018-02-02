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
      'Sunday': 'Sun',
      'Monday': 'Mon',
      'Tuesday': 'Tue',
      'Wednesday': 'Wed',
      'Thursday': 'Thu',
      'Friday': 'Fri',
      'Saturday': 'Sat',
    };

    return (
      <div>
        <div>
          {
            Object.keys(days).map(day => {
              return (
                <p class='datepicker-week-test' onClick={this._sayDay}>{day}</p>
              )
            })
          }
        </div>
      </div>
    );
  }
}
