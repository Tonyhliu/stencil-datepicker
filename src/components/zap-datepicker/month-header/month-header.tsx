import {
  Component,
  Prop,
  State
} from '@stencil/core';

@Component({
  tag: 'month-header',
  styleUrl: 'month-header.scss'
})
export class MonthHeader {
  @Prop() year: number;
  @Prop() month: any;
  @Prop() updateCb: any;
  @Prop() months: any;

  render() {
    return (
      <div class="month-header">
        <p onClick={this.updateCb.bind(null, 'minus')}>&#8592;</p>
        {/* <h1>{`${this.months[this.month]} ${this.year}` || 'Month Header'}</h1> */}
        <p onClick={this.updateCb.bind(null, 'plus')}>&#8594;</p>
      </div>
    );
  }
}
