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
  @Prop() months: any;
  @Prop() secondMonthHeader: boolean;
  @Prop() updateCb: any;

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

    const arrow = this.secondMonthHeader ? <p onClick={this.monthChangedHandler.bind(this, 'plus')}>&#8594;</p> : <p onClick={this.monthChangedHandler.bind(this, 'minus')}>&#8592;</p>;
    return (
      <div class="month-header">
        {/* {this.secondMonthHeader ? '' : arrow} */}
        <p onClick={this.monthChangedHandler.bind(this, 'minus')}>&#8592;</p>
          <h1>{`${months[this.month]} ${this.year}` || 'Month Header'}</h1>
        <p onClick={this.monthChangedHandler.bind(this, 'plus')}>&#8594;</p>
        {/* {this.secondMonthHeader ? arrow : ''} */}
      </div>
    );
  }
}
