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
  @Prop() day: number;
  @Prop() daysInMonth: number;
  @Prop() lastDay: number;
  @Prop() lastDayOfMonth: any;
  @Prop() month: number;
  @Prop() minDateObj: any;
  @Prop() offset: number;
  @Prop() selectedDate: any;
  @Prop() year: number;

  @Event() dateSelected: EventEmitter;
  dateSelectedHandler(evt) {
    this.dateSelected.emit(evt.currentTarget);
  }

  render() {
    let rows = [];
    let lastDay = this.lastDay - this.offset;
    let firstDay = 1;

    let offset = this.offset % 7;
    for (let blank = 0; blank < offset; blank++) {
      rows.push(
        <p class='empty'>{lastDay + 1}</p>
      );
      lastDay++;
    }

    for (let day = 1; day <= this.daysInMonth; day++) {
      let className = 'week-header-test';
      let selectedDay,
        selectedMonth,
        selected;

      if (this.month === this.minDateObj.minMonth && day < this.minDateObj.minDay && new Date(this.date).getFullYear() === this.minDateObj.minYear) {
          rows.push(
            <p class='empty'>{day}</p>
          )
      } else {
        if (this.selectedDate) {
          selectedDay = new Date(this.selectedDate).getUTCDate();
          selectedMonth = (dateFns.getMonth(this.selectedDate) + 1) % 12;
          selected = (selectedDay === day && selectedMonth === this.month)
        }

        className += selected ? ' selected ' : '';
        rows.push(
          <p class={className} onClick={this.dateSelectedHandler.bind(this)}>{day}</p>
        )
      }
    }

    // 3 is weds
    for (let lastDayDate = this.lastDayOfMonth.getDay(); lastDayDate < 6; lastDayDate++) {
      rows.push(
        <p class='empty'>{firstDay}</p>
      )
      firstDay++;
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}
