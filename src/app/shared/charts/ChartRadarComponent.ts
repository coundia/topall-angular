import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart-radar',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart-radar.component.html'
})
export class ChartRadarComponent {
  @Input() labels: string[] = [];
  @Input() datasets: ChartConfiguration<'radar'>['data']['datasets'] = [];
  @Input() options: ChartConfiguration<'radar'>['options'] = {};

  readonly chartType = 'radar';

  @Output() chartClick = new EventEmitter<any>();
  @Output() chartHover = new EventEmitter<any>();

  get radarChartData() {
    return { labels: this.labels, datasets: this.datasets };
  }

  onChartClick(event: any) { this.chartClick.emit(event); }
  onChartHover(event: any) { this.chartHover.emit(event); }

}
