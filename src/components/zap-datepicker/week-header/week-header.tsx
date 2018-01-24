import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Listen
} from '@stencil/core';

@Component({
  tag: 'week-header',
  styleUrl: 'week-header.scss'
})
export class WeekHeader {
  @Prop() date: any;
  @Prop() day: number;
  @Prop() daysInMonth: any;
  @Prop() firstDay: number;
  @Prop() lastDay: number;
  @Prop() leap: boolean;
  @Prop() month: number;
  @Prop() offset: number;
  @Prop() selected: boolean;
  @Prop() selectedDate: any;
  @Prop() updateCb: any;

  @Event() dateSelected: EventEmitter;
  dateSelectedHandler(evt) {
    this.dateSelected.emit(evt.currentTarget);
  }

  render() {
    let rows = [];
    let lastDay = this.lastDay - this.offset;
    let firstDay = this.firstDay;
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
        let selectedYear;
        let selectedTest;
        if (this.selectedDate) {
          selectedDay = this.selectedDate.date();
          selectedMonth = this.selectedDate.month();
          selectedYear = this.selectedDate.year();
          selectedTest = (selectedDay === day && selectedMonth === this.month)
        }
        // debugger;
        className += selectedTest ? ' selected ' : '';
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
