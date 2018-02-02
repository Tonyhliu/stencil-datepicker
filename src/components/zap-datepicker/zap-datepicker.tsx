import {
  Component,
  Prop,
  State,
  Listen
} from '@stencil/core';
import dateFns from 'date-fns';

// < zap - datepicker min - date="01/20/2018" max - date="02/15/2018" ></zap - datepicker >
// < zap - datepicker min - date="default" ></zap - datepicker >
// < zap - datepicker ></zap - datepicker >
// < zap - datepicker multi - date></zap - datepicker >
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
    selectedDate: null
  };

  @State() datesObj: any = {
    firstDate: null,
    secondDate: null,
    hoveredDate: null
  }

  @Listen('singleDateSelected')
  singleDateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, selectedDay), 'MM/DD/YYYY');

    this.dateObj = {
      ...this.dateObj,
      date: newDate,
      month: dateFns.getMonth(newDate) + 1,
      day: selectedDay,
      selectedDate: newDate
    };

    this._closeDatepicker(event.target);

    console.log('date obj', this.dateObj);
    console.log('date', this.dateObj.date);
    console.log('selectedDate', this.dateObj.selectedDate);
  }

  @Listen('multiDateSelected')
  multiDateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, selectedDay), 'MM/DD/YYYY');

    // reset on subsequent clicks after first and second dates have been set
    if (this.datesObj.firstDate && this.datesObj.secondDate || dateFns.isBefore(new Date(newDate), new Date(this.datesObj.firstDate))) {
      this.datesObj = {
        ...this.datesObj,
        firstDate: newDate,
        secondDate: ''
      };
    } else if (!this.datesObj.firstDate) {
      this.datesObj = {
        ...this.datesObj,
        firstDate: newDate,
      };
    } else {
      this.datesObj = {
        ...this.datesObj,
        secondDate: newDate
      }
    }

    // close DP on second click
    // this._closeDatepicker(event.target);
    // clear button (mobile only?)
    // apply button? only on range selector?
    // handle same date click for multi range

    console.log('dates obj', this.datesObj);
  }

  @Listen('multiDateHover')
  multiDateHoverHandler(event: CustomEvent) {
    // debugger
    let hoveredDay = parseInt(event.detail.innerHTML);
    let hoveredDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, hoveredDay), 'MM/DD/YYYY');
    this.datesObj = {
      ...this.datesObj,
      hoveredDate: hoveredDate
    };
  }

  @Listen('monthChanged')
  monthChangedHandler(event: CustomEvent) {
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
        console.log('selectedDate', this.dateObj.selectedDate);
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
        console.log('selectedDate', this.dateObj.selectedDate);
        break;
      default:
        break;
    }
  }

  _clickOffDatepickerHandler = (e) => {
    if (e.target.closest('div.zap-datepicker') == null) {
      this._closeDatepicker(e.target.querySelector('week-header'));
    }
  }

  componentDidLoad() {
    document.addEventListener('click', this._clickOffDatepickerHandler)
  }

  componentDidUnload() {
    document.removeEventListener('click', this._clickOffDatepickerHandler);
  }

  _toggleDatepicker(e) {
    let datepickerContainer = e.target.nextSibling;
    datepickerContainer.style.display = datepickerContainer.style.display ? '' : 'block';
  }

  _closeDatepicker(weekheaderElement) {
    weekheaderElement.parentElement.style.display = '';

    // if click off after picking first but not second date
    if (this.datesObj.firstDate && !this.datesObj.secondDate) {
      this.datesObj = {
        firstDate: null,
        secondDate: null,
        hoveredDate: null
      };
    }
  }

  render() {
    const currentMonth = this.dateObj.month - 1;
    const offset = dateFns.getISODay(new Date(this.dateObj.year, currentMonth, 1));
    const lastMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
    const lastYear = this.dateObj.year - 1;

    const minimumDate = this.minDate === 'default' ? new Date(this.dateObj.date) : new Date(this.minDate);
    const minYear = minimumDate.getFullYear();
    const minMonth = minimumDate.getMonth() + 1;
    const minDay = minimumDate.getUTCDate();

    const maximumDate = new Date(this.maxDate);
    const maxYear = maximumDate.getFullYear();
    const maxMonth = maximumDate.getMonth() + 1;
    const maxDay = maximumDate.getUTCDate();

    const dateRestrictionObj = {
      minimumDate,
      minYear,
      minMonth,
      minDay,
      maximumDate,
      maxYear,
      maxMonth,
      maxDay
    };

    return (
      <div class='zap-datepicker'>
        <p class='selected-date'
          onClick={this._toggleDatepicker}>{!this.multiDate ? this.dateObj.selectedDate || 'Date' : `${this.datesObj.firstDate || 'Start Date'} - ${this.datesObj.secondDate || 'End Date'}`}</p>

        <div class='datepicker-container'>
          <div class='month-container'>
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
              datesObj={this.datesObj}
              day={this.dateObj.day}
              daysInMonth={dateFns.getDaysInMonth(new Date(this.dateObj.year, currentMonth))}
              lastDay={dateFns.getDaysInMonth(new Date(lastYear, lastMonth))}
              lastDayOfMonth={dateFns.lastDayOfMonth(new Date(this.dateObj.year, this.dateObj.month, 0, 0, 0, 0))}
              dateRestrictionObj={dateRestrictionObj}
              month={this.dateObj.month}
              multidate={this.multiDate}
              offset={offset}
              selectedDate={this.dateObj.selectedDate}
              year={this.dateObj.year}
            ></week-header>
          </div>

        </div>
      </div>
    );
  }
}

// interface

// @State() dateObj: any = {
//   date: dateFns.format(new Date(), 'MM/DD/YYYY'),
//   year: parseInt(dateFns.format(new Date(), 'YYYY')),
//   month: parseInt(dateFns.format(new Date(), 'M')),
//   day: parseInt(dateFns.format(new Date(), 'D')),
// };