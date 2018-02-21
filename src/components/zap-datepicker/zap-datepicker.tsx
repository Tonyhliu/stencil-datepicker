import {
  Component,
  Prop,
  State,
  Event,
  EventEmitter,
  Listen
} from '@stencil/core';
import dateFns from 'date-fns';

// < zap - datepicker min - date="01/20/2018" max - date="02/15/2018" ></zap - datepicker >
// < zap - datepicker min - date="default" ></zap - datepicker >
// < zap - datepicker ></zap - datepicker >
// < zap - datepicker multi - date></zap - datepicker >

// handle same date click for multi range
// can click one date and just apply (single date pick)
// need non-sequential date selection
// what needs !important (font size, font family, width & height??)
// multidate -> one click and off click

@Component({
  tag: 'zap-datepicker',
  styleUrl: 'zap-datepicker.scss'
})
export class ZapDatepicker {
  @Prop() minDate: string;
  @Prop() maxDate: string;
  @Prop() multiDate: boolean;
  @Prop() zapDatepickerId: any;

  @State() innerWidth: number;

  @State() dateObj: any = {
    firstDate: dateFns.format(new Date(), 'MM/DD/YYYY'),
    firstDateYear: parseInt(dateFns.format(new Date(), 'YYYY')),
    firstDateMonth: parseInt(dateFns.format(new Date(), 'M')),
    firstDateDay: parseInt(dateFns.format(new Date(), 'D')),
    selectedDate: null,
    secondDate: dateFns.format(dateFns.addMonths(new Date(), 1), 'MM/DD/YYYY'),
    secondDateYear: parseInt(dateFns.format(dateFns.addMonths(new Date(), 1), 'YYYY')),
    secondDateMonth: parseInt(dateFns.format(dateFns.addMonths(new Date(), 1), 'M')),
    secondDateDay: parseInt(dateFns.format(dateFns.addMonths(new Date(), 1), 'D'))
  };

  @State() datesObj: any = {
    firstDate: null,
    secondDate: null,
    hoveredDate: null
  }

  @Event() dateSelected: EventEmitter;
  @Listen('singleDateSelected')
  singleDateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate;
    if (event.srcElement.getAttribute('data-second-month-header')) {
      newDate = dateFns.format(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth - 1, selectedDay), 'MM/DD/YYYY');
    } else {
      newDate = dateFns.format(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth - 1, selectedDay), 'MM/DD/YYYY');
    }

    this.dateObj = {
      ...this.dateObj,
      firstDate: newDate,
      firstDateDay: selectedDay,
      selectedDate: newDate
    };

    this._closeDatepicker();

    let evt = {
      selectedDate: this.dateObj.selectedDate,
      datepickerId: this.zapDatepickerId
    }
    this.dateSelected.emit(evt);

    console.log('date obj', this.dateObj);
    console.log('date', this.dateObj.firstDate);
    console.log('selectedDate', this.dateObj.selectedDate);
  }

  @Listen('multiDateSelected')
  multiDateSelectedHandler(event: CustomEvent) {
    let selectedDay = parseInt(event.detail.innerHTML);
    let newDate;
    if (event.srcElement.getAttribute('data-second-month-header')) {
      newDate = dateFns.format(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth - 1, selectedDay), 'MM/DD/YYYY');
    } else {
      newDate = dateFns.format(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth - 1, selectedDay), 'MM/DD/YYYY');
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

    let evt = {
        ...this.datesObj,
      datepickerId: this.zapDatepickerId
      }
    this.dateSelected.emit(evt);

    console.log('dates obj', this.datesObj);
  }

  @Listen('multiDateHover')
  multiDateHoverHandler(event: CustomEvent) {
    let hoveredDay = parseInt(event.detail.innerHTML);
    let hoveredDate;
    if (event.srcElement.getAttribute('data-second-month-header')) {
      hoveredDate = dateFns.format(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth - 1, hoveredDay), 'MM/DD/YYYY');
    } else {
      hoveredDate = dateFns.format(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth - 1, hoveredDay), 'MM/DD/YYYY');
    }

    this.datesObj = {
      ...this.datesObj,
      hoveredDate
    };
  }

  @Listen('mouseOut')
  mouseOutHandler() {
    this.datesObj = {
      ...this.datesObj,
      hoveredDate: null
    };
  }

  @Listen('monthChanged')
  monthChangedHandler(event: CustomEvent) {
    let newYear = this.dateObj.firstDateYear;
    let newMonth;
    let newDate;

    switch (event.detail) {
      case 'plus':
        newMonth = this.dateObj.firstDateMonth + 1;
        if (newMonth > 12) {
          newYear = this.dateObj.firstDateYear + 1;
          newMonth = 1;
        }

        this.dateObj = {
          ...this.dateObj,
          firstDate: dateFns.format(new Date(newYear, newMonth - 1), 'MM/DD/YYYY'),
          firstDateMonth: newMonth,
          firstDateYear: newYear
        };

        newDate = dateFns.format(dateFns.addMonths(this.dateObj.firstDate, 1), 'MM/DD/YYYY')
        this.dateObj = {
          ...this.dateObj,
          secondDate: newDate,
          secondDateYear: parseInt(dateFns.format(newDate, 'YYYY')),
          secondDateMonth: parseInt(dateFns.format(newDate, 'M')),
        }

        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.firstDate);
        console.log('selectedDate', this.dateObj.selectedDate);
        break;
      case 'minus':
        if (this.dateObj.firstDateMonth === 1) {
          newMonth = 12;
          newYear = this.dateObj.firstDateYear - 1;
        } else {
          newMonth = (this.dateObj.firstDateMonth - 1) % 12;
        }

        this.dateObj = {
          ...this.dateObj,
          firstDate: dateFns.format(new Date(newYear, newMonth - 1), 'MM/DD/YYYY'),
          firstDateMonth: newMonth,
          firstDateYear: newYear ? newYear : this.dateObj.firstDateYear
        };

        newDate = dateFns.format(dateFns.addMonths(this.dateObj.firstDate, 1), 'MM/DD/YYYY');
        this.dateObj = {
          ...this.dateObj,
          secondDate: newDate,
          secondDateYear: parseInt(dateFns.format(newDate, 'YYYY')),
          secondDateMonth: parseInt(dateFns.format(newDate, 'M')),
        }

        console.log('date obj', this.dateObj);
        console.log('date', this.dateObj.firstDate);
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

  _setWindowWidth = () => {
    this.innerWidth = window.innerWidth || document.body.clientWidth;
  }

  _createTRs = () => {
    let currentZapDatepicker = document.querySelector(`zap-datepicker[zap-datepicker-id='${this.zapDatepickerId}']`);
    // select both sides of the months
    let months = currentZapDatepicker.querySelectorAll('.month-container');
    for (let idx = 0; idx < months.length; idx++) {
      const currentMonth = months[idx];
      const currentTbody = currentMonth.querySelector('tbody');
      const currentTds = currentMonth.querySelectorAll('td');
      let tr = document.createElement('tr');

      for (let j = 0; j < currentTds.length; j++) {
        const currentTd = currentTds[j];
        if (j % 7 === 0 && j > 0) {
          currentTbody.appendChild(tr);
          tr = document.createElement('tr');
        }
        tr.appendChild(currentTd);
      }

      // append finalRow
      currentTbody.appendChild(tr);
    }
  }

  componentWillLoad() {
    this._setWindowWidth();
  }

  componentDidLoad() {
    this._createTRs();
    document.addEventListener('click', this._clickOffDatepickerHandler);
    document.addEventListener('dateSelected', (e) => {
      console.log('event dispatched is', e);
    })
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
      target: e.target.parentElement.parentElement.previousSibling
    }
    this._toggleDatepicker(e);
  }

  render() {
    const currentMonth = this.dateObj.firstDateMonth - 1;
    const offset = dateFns.getISODay(new Date(this.dateObj.firstDateYear, currentMonth, 1));
    const offsetTwo = dateFns.getISODay(new Date(this.dateObj.firstDateYear, currentMonth + 1, 1));
    const lastMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
    const lastYear = this.dateObj.firstDateYear - 1;

    const minimumDate = this.minDate === 'default' ? new Date(this.dateObj.firstDate) : new Date(this.minDate);
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
      <div class={`zap-datepicker ${this.innerWidth < 800 ? 'mobile-view' : ''}`}>
        <p class='selected-date'
          onClick={this._toggleDatepicker}>{!this.multiDate ? this.dateObj.selectedDate || 'Date' : `${this.datesObj.firstDate || 'Start Date'} - ${this.datesObj.secondDate || 'End Date'}`}
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2000.000000 2000.000000"
          preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,2000.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="#000000">
          <path d="M6500 19155 c-341 -76 -592 -330 -656 -663 -11 -57 -14 -179 -14 -533 l0 -459 -920 0 c-964 0 -1018 -2 -1240 -46 -499 -98 -952 -348 -1315 -726 -235 -245 -422 -543 -540 -862 -50 -137 -109 -375 -132 -531 -17 -125 -18 -355 -18 -6175 0 -5668 1 -6052 17 -6157 24 -159 64 -330 104 -451 201 -601 598 -1085 1147 -1399 295 -168 663 -283 1007 -313 90 -8 1815 -10 6140 -8 5724 3 6020 4 6120 21 58 10 161 32 229 48 458 112 899 367 1218 703 396 419 633 947 683 1526 14 158 14 11911 0 12070 -54 617 -316 1174 -751 1596 -379 366 -808 581 -1359 681 -85 15 -202 17 -1072 20 l-978 4 0 459 c0 354 -3 475 -14 532 -80 411 -442 696 -860 675 -213 -11 -378 -78 -528 -216 -110 -102 -188 -225 -239 -376 -23 -69 -24 -76 -27 -572 l-3 -503 -2499 0 -2499 0 -3 503 c-3 496 -4 503 -27 572 -51 151 -129 274 -239 376 -105 97 -211 154 -358 195 -83 22 -291 28 -374 9z m-668 -3817 c4 -476 5 -496 26 -566 89 -293 306 -505 597 -583 108 -29 297 -32 405 -5 101 24 261 103 338 166 135 110 241 281 282 450 18 79 20 118 20 558 l0 472 2500 0 2500 0 0 -472 c0 -440 2 -479 20 -558 40 -169 143 -334 278 -446 80 -66 238 -145 342 -170 108 -27 297 -24 405 5 291 78 508 290 597 583 21 70 22 90 26 566 l3 493 897 -3 c1006 -4 938 1 1112 -80 243 -112 415 -333 466 -596 12 -61 14 -295 14 -1363 l0 -1289 -6660 0 -6660 0 0 1289 c0 1395 -1 1358 54 1505 85 225 278 411 511 491 121 42 154 43 1057 44 l867 1 3 -492z m10826 -8330 l-3 -3823 -23 -73 c-46 -149 -125 -275 -239 -383 -108 -102 -221 -162 -383 -206 -62 -17 -377 -18 -5925 -21 -3847 -2 -5899 1 -5972 7 -206 19 -369 90 -510 225 -114 107 -189 228 -235 378 l-23 73 -3 3823 -2 3822 6660 0 6660 0 -2 -3822z"/>
          </g>
          </svg>
        </p>

        <div class='datepicker-container'>
          <div class={`mobile-date-header ${this.innerWidth < 800 ? '' : 'hide'}`}>
            <p>{!this.multiDate ? this.dateObj.selectedDate || 'Date' : `${this.datesObj.firstDate || 'Start Date'} - ${this.datesObj.secondDate || 'End Date'}`}</p>
          </div>
          <div class='month-container first-month-container'>
            <month-header
              year={this.dateObj.firstDateYear}
              month={this.dateObj.firstDateMonth - 1}
              mobile={this.innerWidth < 800}
              >
            </month-header>
            <datepicker-week>
            </datepicker-week>
            <week-header
              date={this.dateObj.firstDate}
              datesObj={this.datesObj}
              day={this.dateObj.firstDateDay}
              daysInMonth={dateFns.getDaysInMonth(new Date(this.dateObj.firstDateYear, currentMonth))}
              lastDay={dateFns.getDaysInMonth(new Date(lastYear, lastMonth))}
              lastDayOfMonth={dateFns.lastDayOfMonth(new Date(this.dateObj.firstDateYear, this.dateObj.firstDateMonth, 0, 0, 0, 0))}
              dateRestrictionObj={dateRestrictionObj}
              month={this.dateObj.firstDateMonth}
              multidate={this.multiDate}
              offset={offset}
              selectedDate={this.dateObj.selectedDate}
              year={this.dateObj.firstDateYear}
            ></week-header>
          </div>
          <div class='month-container second-month-container'>
            <month-header
              year={this.dateObj.secondDateYear}
              month={this.dateObj.secondDateMonth - 1}
              mobile={this.innerWidth < 800}
              secondMonthHeader
              >
            </month-header>
            <datepicker-week>
            </datepicker-week>
            <week-header
              data-second-month-header
              date={this.dateObj.secondDate}
              datesObj={this.datesObj}
              day={this.dateObj.secondDateDay}
              daysInMonth={dateFns.getDaysInMonth(new Date(this.dateObj.secondDateYear, currentMonth + 1))}
              lastDay={dateFns.getDaysInMonth(new Date(lastYear, lastMonth))}
              lastDayOfMonth={dateFns.lastDayOfMonth(new Date(this.dateObj.secondDateYear, this.dateObj.secondDateMonth, 0, 0, 0, 0))}
              dateRestrictionObj={dateRestrictionObj}
              month={this.dateObj.secondDateMonth}
              multidate={this.multiDate}
              offset={offsetTwo}
              selectedDate={this.dateObj.selectedDate}
              year={this.dateObj.secondDateYear}
            ></week-header>
          </div>
          <div class="buttons-container">
            <button onClick={(e) => this._clearDates(e)}>Clear</button>
            {this.multiDate ? <button onClick={(e) => this._applyDates(e)}>Apply</button> : ''}
          </div>
        </div>
      </div>
    );
  }
}