import {
  Component,
  Prop,
  Event,
  EventEmitter,
} from '@stencil/core';
import dateFns from 'date-fns';

@Component({
  tag: 'week-header',
  styleUrl: 'week-header.scss'
})
export class WeekHeader {
  @Prop() date: any;
  @Prop() datesObj: any;
  @Prop() day: number;
  @Prop() daysInMonth: number;
  @Prop() lastDay: number;
  @Prop() lastDayOfMonth: any;
  @Prop() month: number;
  @Prop() multidate: boolean;
  @Prop() dateRestrictionObj: any;
  @Prop() offset: number;
  @Prop() selectedDate: any;
  @Prop() year: number;
  @Prop() todaysDate: string;

  @Event() singleDateSelected: EventEmitter;
  singleDateSelectedHandler(evt) {
    this.singleDateSelected.emit(evt.currentTarget);
  }

  @Event() multiDateSelected: EventEmitter;
  multiDateSelectedHandler(evt) {
    this.multiDateSelected.emit(evt.currentTarget);
  }

  @Event() multiDateHover: EventEmitter;
  multiDateHoverHandler(evt) {
    this.multiDateHover.emit(evt.target);
  }

  @Event() mouseOut: EventEmitter;
  mouseOutHandler(evt) {
    this.mouseOut.emit(evt.target);
  }

  render() {
    let rows = [];
    let lastDay = this.lastDay - this.offset;
    let firstDay = 1;

    let offset = this.offset % 7;
    for (let blank = 0; blank < offset; blank++) {
      rows.push(
        <td class='empty last-month'>{lastDay + 1}</td>
      );
      lastDay++;
    }

    for (let day = 1; day <= this.daysInMonth; day++) {
      let className = 'week-header';
      let selectedDay,
        selectedMonth,
        selectedYear,
        selected,
        beforeDate,
        afterDate;

      // if there is a min & max date restriction
      const currentDate = new Date(this.year, this.month - 1, day);
      const maxDate = new Date(this.dateRestrictionObj.maximumDate);
      const minDate = new Date(this.dateRestrictionObj.minimumDate);
      let todaysDate = dateFns.isEqual(currentDate, this.todaysDate);

      if (dateFns.isAfter(minDate, currentDate) || dateFns.isBefore(maxDate, currentDate)) {
        rows.push(
          <td class='empty'>{day}</td>
        )
      } else {
        if (this.datesObj.firstDate && this.datesObj.secondDate) {
          // if firstDate and secondDate are selected
          if (dateFns.isWithinRange(new Date(this.year, this.month - 1, day), new Date(this.datesObj.firstDate), new Date(this.datesObj.secondDate))) {
            selected = true;
          } else {
            selected = false;
          }
        } else if (this.datesObj.firstDate && this.datesObj.hoveredDate) {
          // if firstDate selected and hovering
          selectedDay = new Date(this.datesObj.firstDate).getUTCDate();
          selectedMonth = dateFns.getMonth(this.datesObj.firstDate) + 1;
          selectedYear = dateFns.getYear(this.datesObj.firstDate);
          selected = (selectedDay === day && selectedMonth === this.month && selectedYear === this.year);

          if (dateFns.isBefore(currentDate, this.datesObj.firstDate)) {
            className += ' before-date ';
            todaysDate = false;
          } else if (dateFns.isAfter(dateFns.addDays(this.datesObj.hoveredDate, 1), currentDate) && dateFns.isAfter(currentDate, this.datesObj.firstDate)) {
            // if hovered date is after first selectedDate
            className += ' after-date ';
            todaysDate = false;
          }
        } else {
          // logic for single date picker
          if (this.selectedDate || this.datesObj.firstDate) {
            let selectedDate = this.selectedDate || this.datesObj.firstDate;
            selectedDay = new Date(selectedDate).getUTCDate();
            selectedMonth = dateFns.getMonth(selectedDate) + 1;
            selectedYear = dateFns.getYear(selectedDate);
            selected = (selectedDay === day && selectedMonth === this.month && selectedYear === this.year)
          }
        }

        if (selected) {
          className += ' selected ';
          todaysDate = false;
        }

        if (todaysDate) {
          className += ' today '
        }

        rows.push(
          <td class={className}
            onClick={this.multidate ? this.multiDateSelectedHandler.bind(this) : this.singleDateSelectedHandler.bind(this)}
            onMouseOver={this.multidate && this.datesObj.firstDate && this.multiDateHoverHandler.bind(this)}
            onMouseOut={this.mouseOutHandler.bind(this)}>
            {day}
          </td>
        )
      }
    }

    // Wednesday -> 3
    // Get the last day of the month to prepopulate rest of month with days of next month
    for (let lastDayDate = this.lastDayOfMonth.getDay(); lastDayDate < 6; lastDayDate++) {
      rows.push(
        <td class='empty next-month'>{firstDay}</td>
      )
      firstDay++;
    }

    return (
      <table id='my-table'>
        <tbody class='week-header-container'>
          {rows}
        </tbody>
      </table>
    );
  }
}
