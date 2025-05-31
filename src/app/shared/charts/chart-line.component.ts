import { Component, Input, Output, EventEmitter, Signal, signal, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {FullscreenButtonComponent} from '../components/screen/app-fullscreen-button';

@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [BaseChartDirective, FullscreenButtonComponent],
  templateUrl: './chart-line.component.html'
})
export class ChartLineComponent {
  @Input() labels: string[] = [];
  @Input() datasets: ChartConfiguration<'line'>['data']['datasets'] = [];
  @Output() chartClick = new EventEmitter<{ label: string, index: number, event: any }>();

  @ViewChild('chartContainer') chartContainer?: ElementRef<HTMLDivElement>;
  isFullscreen = signal(false);

  lineChartData: Signal<ChartConfiguration<'line'>['data']> = signal({ labels: [], datasets: [] });
  lineChartType: 'line' = 'line';
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 5 }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value, index, ticks) {
            // @ts-ignore
            const label = this.getLabelForValue ? this.getLabelForValue(value) : value;
            if (typeof label === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(label)) {
              const date = new Date(label);
              return date.toLocaleDateString('fr-FR');
            }
            return label;
          }
        }
      },
      y: { beginAtZero: true }
    }
  };

  ngOnChanges() {
    this.lineChartData = signal({
      labels: this.labels,
      datasets: this.datasets
    });
  }

  onChartClick(event: any) {
    console.log("Chart clicked:", event);
      this.chartClick.emit(event);

  }


  toggleFullscreen() {
    const el = this.chartContainer?.nativeElement;
    if (!this.isFullscreen() && el && el.requestFullscreen) {
      el.requestFullscreen();
    } else if (this.isFullscreen() && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', [])
  onFullscreenChange() {
    this.isFullscreen.set(!!document.fullscreenElement);
  }
}
