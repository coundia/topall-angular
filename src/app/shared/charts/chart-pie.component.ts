import { Component, Input, Output, EventEmitter, Signal, signal, ViewChild, ElementRef, HostListener } from '@angular/core'
import { ChartConfiguration } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import {FullscreenButtonComponent} from '../components/screen/app-fullscreen-button';

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [BaseChartDirective, FullscreenButtonComponent],
  templateUrl: './chart-pie.component.html'
})
export class ChartPieComponent {
  @Input() labels: string[] = []
  @Input() datasets: ChartConfiguration<'pie'>['data']['datasets'] = []
  @Output() chartClick = new EventEmitter<any>()
  @Output() chartHover = new EventEmitter<any>()

  @ViewChild('chartContainer') chartContainer?: ElementRef<HTMLDivElement>
  isFullscreen = signal(false)

  pieChartData: Signal<ChartConfiguration<'pie'>['data']> = signal({ labels: [], datasets: [] })
  pieChartType: 'pie' = 'pie'
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    aspectRatio: 2,
    plugins: { legend: { display: true, position: 'top' } }
  }

  ngOnChanges() {
    this.pieChartData = signal({ labels: this.labels, datasets: this.datasets })
  }

  onChartClick(e: any) { this.chartClick.emit(e) }
  onChartHover(e: any) { this.chartHover.emit(e) }

  toggleFullscreen() {
    const el = this.chartContainer?.nativeElement
    if (!this.isFullscreen() && el?.requestFullscreen) el.requestFullscreen()
    else if (this.isFullscreen() && document.fullscreenElement) document.exitFullscreen()
  }

  @HostListener('document:fullscreenchange', [])
  onFsChange() { this.isFullscreen.set(!!document.fullscreenElement) }
}
