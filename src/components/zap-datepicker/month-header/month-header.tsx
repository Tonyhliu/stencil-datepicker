import {
  Component,
  Prop,
  Event,
  EventEmitter
} from '@stencil/core';

@Component({
  tag: 'month-header',
  styleUrl: 'month-header.scss'
})
export class MonthHeader {
  @Prop() year: number;
  @Prop() month: number;
  @Prop() mobile: boolean;
  @Prop() secondMonthHeader: boolean;

  @Event() monthChanged: EventEmitter;
  monthChangedHandler(arrowDirection) {
    this.monthChanged.emit(arrowDirection)
  }

  render() {
    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    };

    // if first month header, left arrow. Otherwise, right arrow
    let arrow = this.secondMonthHeader ? <p onClick={this.monthChangedHandler.bind(this, 'plus')}>&#8594;</p> : <p onClick={this.monthChangedHandler.bind(this, 'minus')}>&#8592;</p>;

    if (this.mobile && this.secondMonthHeader) {
      // down arrow if its the second monthHeader & on mobile
      console.log('down arrow');
      arrow = <p onClick={this.monthChangedHandler.bind(this, 'plus')}>&#8595;</p>;
    } else if (this.mobile && !this.secondMonthHeader) {
      console.log('up arrow');
      arrow = <p onClick={this.monthChangedHandler.bind(this, 'minus')}>&#8593;</p>;
    }

    return (
      <div class='month-header'>
        {this.secondMonthHeader ? '' : arrow}
          <h3>{`${months[this.month]} ${this.year}` || 'Month Header'}</h3>
        {this.secondMonthHeader ? arrow : ''}
      </div>
    );
  }
}
