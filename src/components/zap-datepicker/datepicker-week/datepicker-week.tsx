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
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    return (
      <div>
        <div>
          {
            days.map(day => {
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
