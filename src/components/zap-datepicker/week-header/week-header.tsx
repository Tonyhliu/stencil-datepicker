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
  @Prop() month: number;
  @Prop() offset: number;
  @Prop() selectedDate: any;

  @Event() dateSelected: EventEmitter;
  dateSelectedHandler(evt) {
    this.dateSelected.emit(evt.currentTarget);
  }

  render() {
    let rows = [];
    let lastDay = this.lastDay - this.offset;
    let firstDay = 1;
    let day = 1;

    for (let i = 0; i < 42; i++) {
      if (i < this.offset) {
        rows.push(
          <p class='empty'>{lastDay + 1}</p>
        );
        lastDay++;
      } else if (day > this.daysInMonth) {
        rows.push(
          <p class='empty'>{firstDay}</p>
        )
        firstDay++;
      } else {
        let className = 'week-header-test';
        let selectedDay;
        let selectedMonth;
        let selected;
        // let selectedYear;
        if (this.selectedDate) {
          debugger
          selectedDay = new Date(this.selectedDate).getUTCDate();
          selectedMonth = (dateFns.getMonth(this.selectedDate) + 1) % 12;
          // selectedYear = this.selectedDate.year();
          selected = (selectedDay === day && selectedMonth === this.month)
          // debugger
        }

        // debugger;
        className += selected ? ' selected ' : '';
        rows.push(
          <p class={className} onClick={this.dateSelectedHandler.bind(this)}>{day}</p>
        )
        day++;
      }
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}
