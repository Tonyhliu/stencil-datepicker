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

  @State() newDate: string = dateFns.format(dateFns.addMonths(this.dateObj.date, 1), 'MM/DD/YYYY');
  @State() dateObjTwo: any = {
    date: this.newDate,
    year: parseInt(dateFns.format(this.newDate, 'YYYY')),
    month: parseInt(dateFns.format(this.newDate, 'M')),
    day: parseInt(dateFns.format(this.newDate, 'D'))
  }

  @State() datesObj: any = {
    firstDate: null,
    secondDate: null,
    hoveredDate: null
  }

  @Listen('singleDateSelected')
  singleDateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate;
    if (event.srcElement.getAttribute('data-second-month-header')) {
      newDate = dateFns.format(new Date(this.dateObjTwo.year, this.dateObjTwo.month - 1, selectedDay), 'MM/DD/YYYY');
    } else {
      newDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, selectedDay), 'MM/DD/YYYY');
    }

    this.dateObj = {
      ...this.dateObj,
      date: newDate,
      // month: dateFns.getMonth(newDate) + 1,
      day: selectedDay,
      selectedDate: newDate
    };

    this._closeDatepicker();

    console.log('date obj', this.dateObj);
    console.log('date', this.dateObj.date);
    console.log('selectedDate', this.dateObj.selectedDate);
  }

  @Listen('multiDateSelected')
  multiDateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate;
    if (event.srcElement.getAttribute('data-second-month-header')) {
      newDate = dateFns.format(new Date(this.dateObjTwo.year, this.dateObjTwo.month - 1, selectedDay), 'MM/DD/YYYY');
    } else {
      newDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, selectedDay), 'MM/DD/YYYY');
    }

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

    // apply button? only on range selector?
    // handle same date click for multi range

    console.log('dates obj', this.datesObj);
  }

  @Listen('multiDateHover')
  multiDateHoverHandler(event: CustomEvent) {
    let hoveredDay = parseInt(event.detail.innerHTML);
    let hoveredDate;
    if (event.srcElement.getAttribute('data-second-month-header')) {
      hoveredDate = dateFns.format(new Date(this.dateObjTwo.year, this.dateObjTwo.month - 1, hoveredDay), 'MM/DD/YYYY');
    } else {
      hoveredDate = dateFns.format(new Date(this.dateObj.year, this.dateObj.month - 1, hoveredDay), 'MM/DD/YYYY');
    }

    this.datesObj = {
      ...this.datesObj,
      hoveredDate
    };
  }

  @Listen('monthChanged')
  monthChangedHandler(event: CustomEvent) {
    let newYear = this.dateObj.year;
    let newMonth;
    let newDate;

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

        newDate = dateFns.format(dateFns.addMonths(this.dateObj.date, 1), 'MM/DD/YYYY')
        this.dateObjTwo = {
          ...this.dateObjTwo,
          date: newDate,
          year: parseInt(dateFns.format(newDate, 'YYYY')),
          month: parseInt(dateFns.format(newDate, 'M')),
        }

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

        newDate = dateFns.format(dateFns.addMonths(this.dateObj.date, 1), 'MM/DD/YYYY');
        this.dateObjTwo = {
          ...this.dateObjTwo,
          date: newDate,
          year: parseInt(dateFns.format(newDate, 'YYYY')),
          month: parseInt(dateFns.format(newDate, 'M')),
        }

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
      this._closeDatepicker();
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
    let displayStyle = datepickerContainer.getAttribute('style') ? '' : 'display: inline-block !important';
    datepickerContainer.setAttribute('style', displayStyle);
  }

  _closeDatepicker() {
    let datepickerElements = document.querySelectorAll('.datepicker-container');
    for (let idx = 0; idx < datepickerElements.length; idx++) {
      const datepicker = datepickerElements[idx];
      datepicker.setAttribute('style', '');
    }

    // if click off after picking first but not second date
    if (this.datesObj.firstDate && !this.datesObj.secondDate) {
      this.datesObj = {
        firstDate: null,
        secondDate: null,
        hoveredDate: null
      };
    }
  }

  _clearDates(e) {
    e.preventDefault();

    this.dateObj = {
      ...this.dateObj,
      selectedDate: null
    }

    this.datesObj = {
      ...this.datesObj,
      firstDate: null,
      secondDate: null,
      hoveredDate: null
    }
  }

  _applyDates(e) {
    e.preventDefault();
    e = {
      ...e,
      target: e.target.parentElement.previousSibling
    }
    this._toggleDatepicker(e);
  }

  render() {
    const currentMonth = this.dateObj.month - 1;
    const offset = dateFns.getISODay(new Date(this.dateObj.year, currentMonth, 1));
    const offsetTwo = dateFns.getISODay(new Date(this.dateObj.year, currentMonth + 1, 1));
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
          <div class='month-container'>
            <month-header
              year={this.dateObjTwo.year}
              month={this.dateObjTwo.month - 1}
              secondMonthHeader
              >
            </month-header>
            <datepicker-week>
            </datepicker-week>
            <week-header
              data-second-month-header
              date={this.dateObjTwo.date}
              datesObj={this.datesObj}
              day={this.dateObjTwo.day}
              daysInMonth={dateFns.getDaysInMonth(new Date(this.dateObjTwo.year, currentMonth + 1))}
              lastDay={dateFns.getDaysInMonth(new Date(lastYear, lastMonth))}
              lastDayOfMonth={dateFns.lastDayOfMonth(new Date(this.dateObjTwo.year, this.dateObjTwo.month, 0, 0, 0, 0))}
              dateRestrictionObj={dateRestrictionObj}
              month={this.dateObjTwo.month}
              multidate={this.multiDate}
              offset={offsetTwo}
              selectedDate={this.dateObj.selectedDate}
              year={this.dateObjTwo.year}
            ></week-header>
          </div>
          <button onClick={(e) => this._clearDates(e)}>Clear</button>
          {this.multiDate ? <button onClick={(e) => this._applyDates(e)}>Apply</button> : ''}
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