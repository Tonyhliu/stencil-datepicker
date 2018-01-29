import {
  Component,
  Prop,
  State,
  Listen
} from '@stencil/core';
import moment from 'moment';

@Component({
  tag: 'zap-datepicker',
  styleUrl: 'zap-datepicker.scss'
})
export class ZapDatepicker {
  @Prop() minDate: string;
  @Prop() maxDate: string;
  @Prop() multiDate: boolean;

  @State() dateObj: any = {
    date: moment(),
    year: moment().year(),
    month: moment().month(),
    day: moment().day(),
  };
  @State() selected: boolean = false;
  @State() selectedDate: any;
  @State() momentTest: any = moment;

  @Listen('dateSelected')
  dateSelectedHandler(event: CustomEvent) {
    // debugger;
    if (!this.selected) {
      this.selected = true;
    };

    let newDate = this.dateObj.date.date(parseInt(event.detail.innerHTML));

    this.selectedDate = newDate;
    this.dateObj = {
      ...this.dateObj,
      date: newDate,
      month: newDate.month(),
      day: newDate.date()
    };

    console.log('date obj', this.dateObj);
    console.log('date', this.dateObj.date.format());
  }

  // updateDate(e) {
  //   let newDate = moment().date(e.target.innerHTML);
  //   this.dateObj = {
  //     ...this.dateObj,
  //     date: newDate,
  //     month: newDate.month(),
  //     day: newDate.date()
  //   };
  // }

  changeMonthAndYear(arrowDirection) {
    let newYear = this.dateObj.year;
    // this.selected = false;
    // debounce?
    switch (arrowDirection) {
      case 'plus':
        if ((this.dateObj.month + 1) > 11) {
          newYear = this.dateObj.year + 1;
        }

        this.dateObj = {
          ...this.dateObj,
          date: moment({year: newYear, month: (this.dateObj.month + 1) % 12}),
          month: (this.dateObj.month + 1) % 12,
          year: newYear ? newYear : this.dateObj.year
        };

        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.date.format());
        break;
      case 'minus':
        let newMonth;

        // when going from Jan -> Dec
        if (this.dateObj.month - 1 < 0) {
          newMonth = 11;
          newYear = this.dateObj.year - 1;
        } else {
          newMonth = (this.dateObj.month - 1) % 12;
        }

        this.dateObj = {
          ...this.dateObj,
          date: moment({ year: newYear, month: newMonth }),
          month: newMonth,
          year: newYear ? newYear : this.dateObj.year
        };

        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.date.format());
        break;
      default:
        break;
    }
  }

  render() {
    const offset = moment({ year: this.dateObj.year, month: this.dateObj.month }).startOf('month').weekday();
    const lastDayOfLastMonth = moment(this.dateObj.date).subtract(1, 'months').endOf('month').date();
    const firstDayOfNextMonth = moment(this.dateObj.date).add(1, 'months').startOf('month').date();

    return (
      <div>
        <p>Calendar Test</p>
        <month-header
          year={this.dateObj.year}
          month={this.dateObj.month}
          updateCb={this.changeMonthAndYear.bind(this)}
          months={moment.months()}
          >
        </month-header>
        <datepicker-week>
        </datepicker-week>
        <week-header
          // pass dateObj instead?
          date={this.dateObj.date}
          day={this.dateObj.day}
          daysInMonth={moment(this.dateObj.date).daysInMonth()}
          firstDay={firstDayOfNextMonth}
          lastDay={lastDayOfLastMonth}
          leap={this.dateObj.date.isLeapYear()}
          month={this.dateObj.month}
          offset={offset}
          // selected={this.selected}
          selectedDate={this.selectedDate}
          // updateCb={this.updateDate.bind(this)}
        ></week-header>
      </div>
    );
  }
}
