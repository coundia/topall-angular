import { Component, Input, Output, EventEmitter, Signal, signal, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart-bar.component.html'
})
export class ChartBarComponent {
  @Input() labels: string[] = [];
  @Input() datasets: ChartConfiguration<'bar'>['data']['datasets'] = [];
  @Output() chartClick = new EventEmitter<any>();
  @Output() chartHover = new EventEmitter<any>();
  @Output() update = new EventEmitter<void>();

  @ViewChild('chartContainer') chartContainer?: ElementRef<HTMLDivElement>;
  isFullscreen = signal(false);

  barChartData: Signal<ChartConfiguration<'bar'>['data']> = signal({ labels: [], datasets: [] });
  barChartType: 'bar' = 'bar';
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  ngOnChanges() {
    this.barChartData = signal({
      labels: this.labels,
      datasets: this.datasets
    });
  }

  onChartClick(event: any) {
    this.chartClick.emit(event);
  }
  onChartHover(event: any) {
    this.chartHover.emit(event);
  }
  onUpdate() {
    this.update.emit();
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
