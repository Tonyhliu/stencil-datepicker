import {
  Component,
  Prop,
} from '@stencil/core';

@Component({
  tag: 'datepicker-week',
  styleUrl: 'datepicker-week.scss'
})
export class DatepickerWeek {
  @Prop() mobile: boolean;
  _sayDay() {
    console.log(this);
  }

  render() {
    const days = {
      'Su': 'S',
      'Mo': 'M',
      'Tu': 'T',
      'We': 'W',
      'Th': 'T',
      'Fr': 'F',
      'Sa': 'S',
    };

    return (
      <div class='datepicker-week-container'>
          {
            Object.keys(days).map(day => {
              return (
                <th class='datepicker-week-header'>
                  {this.mobile ? days[day] : day}
                </th>
              )
            })
          }
      </div>
    );
  }
}
