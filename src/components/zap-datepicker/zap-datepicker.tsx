import {
  Component,
  Prop,
  State,
  Listen
} from '@stencil/core';
// import moment from 'moment';
// import isToday from 'date-fns/is_today';
import dateFns from 'date-fns';

@Component({
  tag: 'zap-datepicker',
  styleUrl: 'zap-datepicker.scss'
})
export class ZapDatepicker {
  @Prop() minDate: string;
  @Prop() maxDate: string;
  @Prop() multiDate: boolean;

  @State() dateObj: any = {
    date: dateFns.format(new Date(), 'MM/DD/YYYY'),
    year: parseInt(dateFns.format(new Date(), 'YYYY')),
    month: parseInt(dateFns.format(new Date(), 'M')),
    day: parseInt(dateFns.format(new Date(), 'D')),
  };
  @State() selectedDate: any;

  @Listen('dateSelected')
  dateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, selectedDay), 'MM/DD/YYYY');
    // debugger;

    this.selectedDate = newDate;
    this.dateObj = {
      ...this.dateObj,
      date: newDate,
      month: dateFns.getMonth(newDate) + 1,
      day: selectedDay
    };

    console.log('date obj', this.dateObj);
    console.log('date', this.dateObj.date);
  }

  @Listen('monthChanged')
  monthChangedHandler(event: CustomEvent) {
    // debounce?
    let newYear = this.dateObj.year;
    let newMonth;

    switch (event.detail) {
      case 'plus':
        newMonth = this.dateObj.month + 1;
        if (newMonth > 12) {
          newYear = this.dateObj.year + 1;
          newMonth = 1;
        }

        this.dateObj = {
          ...this.dateObj,
          date: dateFns.format(new Date(newYear, newMonth - 1), 'MM/DD/YYYY'),
          month: newMonth,
          year: newYear
        };

        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.date);
        break;
      case 'minus':
        if (this.dateObj.month === 1) {
          newMonth = 12;
          newYear = this.dateObj.year - 1;
        } else {
          newMonth = (this.dateObj.month - 1) % 12;
        }

        this.dateObj = {
          ...this.dateObj,
          date: dateFns.format(new Date(newYear, newMonth - 1), 'MM/DD/YYYY'),
          month: newMonth,
          year: newYear ? newYear : this.dateObj.year
        };

        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.date);
        break;
      default:
        break;
    }
  }

  render() {
    const currentMonth = this.dateObj.month - 1;
    const offset = dateFns.getISODay(new Date(this.dateObj.year, currentMonth, 1));

    const lastMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
    const lastYear = this.dateObj.year - 1;

    return (
      <div>
        <p>Calendar Test</p>
        <month-header
          year={this.dateObj.year}
          month={this.dateObj.month - 1}
          >
        </month-header>
        <datepicker-week>
        </datepicker-week>
        <week-header
          // pass dateObj instead?
          date={this.dateObj.date}
          day={this.dateObj.day}
          daysInMonth={dateFns.getDaysInMonth(new Date(this.dateObj.year, currentMonth))}
          lastDay={dateFns.getDaysInMonth(new Date(lastYear, lastMonth))}
          month={this.dateObj.month}
          offset={offset}
          selectedDate={this.selectedDate}
        ></week-header>
      </div>
    );
  }
}
