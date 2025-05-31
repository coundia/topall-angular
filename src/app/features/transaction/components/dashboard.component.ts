import {Component, computed, effect, signal} from '@angular/core';
import {ChartLineComponent} from '../../../shared/charts/chart-line.component';
import {ChartConfiguration, ChartType} from 'chart.js';
import {TransactionService} from '../services/transaction.service';
import {AlertService} from '../../../shared/components/alert/alert.service';
import {FormsModule} from '@angular/forms';
import {Transaction} from '../models/transaction.model';
import {DatePipe, DecimalPipe} from '@angular/common';
import {EntityListByDateComponent} from '../../../shared/charts/entity-list-by-date.component';
import {ChartBarComponent} from '../../../shared/charts/chart-bar.component';
import {ChartPieComponent} from '../../../shared/charts/chart-pie.component';
import {ChartRadarComponent} from '../../../shared/charts/ChartRadarComponent';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartLineComponent,
    FormsModule,
    EntityListByDateComponent,
    DecimalPipe,
    ChartBarComponent,
    ChartPieComponent,
    ChartRadarComponent,
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  readonly transactions = computed(() => this.transactionService.transactions());

  lineLabels = signal<string[]>([]);
  lineDatasets = signal<ChartConfiguration<'line'>['data']['datasets']>([]);

  dateStart = signal<string | null>(null);
  dateEnd = signal<string | null>(null);

  page = signal(0);
  size = signal(1000);

  totalPages = computed(() => this.transactionService.totalPages());
  totalElements = computed(() => this.transactionService.totalElements());
  selectedFilterDate = signal<string | null>(null);
  showModal = signal(false);
  modalTransactions = signal<Transaction[]>([]);

  barLabels = signal(['Janvier', 'Février', 'Mars', 'Avril']);
  barDatasets = signal<ChartConfiguration<'bar'>['data']['datasets']>([]);

  pieLabels = signal<string[]>([])
  pieDatasets = signal<ChartConfiguration<'pie'>['data']['datasets']>([])

  radarLabels = signal<string[]>([])
  radarDatasets = signal<ChartConfiguration<'radar'>['data']['datasets']>([])

  updateRadarChart() {
    // 1. Construire un tableau de 7 dates ISO (dernier jour au plus ancien)
    const isoDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().substring(0, 10); // ex : "2025-06-09"
    });

    const labels = isoDays.map(iso => {
      const [year, month, day] = iso.split('-');
      return `${day}/${month}`;
    });

    const inData: number[] = [];
    const outData: number[] = [];

    isoDays.forEach(dayIso => {
      let sumIn = 0;
      let sumOut = 0;
      this.transactions().forEach(t => {
        if (t.dateTransaction?.substring(0, 10) === dayIso) {
          if (t.typeTransactionRaw === 'IN') sumIn += t.amount;
          else if (t.typeTransactionRaw === 'OUT') sumOut += t.amount;
        }
      });
      inData.push(sumIn);
      outData.push(sumOut);
    });

    this.radarLabels.set(labels);
    this.radarDatasets.set([
      { data: inData, label: 'Entrées' },
      { data: outData, label: 'Sorties' }
    ]);
  }

  updatePieChart() {
    const group: Record<string, number> = {}
    this.transactions().forEach(t => {
      group[t.typeTransactionRaw ?? 'Autre'] = (group[t.typeTransactionRaw ?? 'Autre'] || 0) + t.amount
    })
    const labels = Object.keys(group)
    this.pieLabels.set(labels)
    this.pieDatasets.set([{data: labels.map(l => group[l]), backgroundColor: ['#16a34a', '#dc2626', '#2563eb']}])
  }

  getBarColor(type: string) {
    if (type === 'IN') return '#16a34a';
    if (type === 'OUT') return '#dc2626';
    return '#2563eb';
  }

  updateBarChart() {
    const txs = this.transactions();
    const group: Record<string, number> = {};

    txs.forEach(t => {
      const type = t.typeTransactionRaw ?? 'Inconnu';
      group[type] = (group[type] || 0) + t.amount;
    });

    const labels = Object.keys(group);
    const data = labels.map(l => group[l]);
    const backgroundColor = labels.map(l => this.getBarColor(l));

    this.barLabels.set(labels);
    this.barDatasets.set([
      {
        label: 'Total par type',
        data,
        backgroundColor,
        borderRadius: 8
      }
    ]);
  }


  onBarChartClick(event: any) {
    const chart = event.event?.chart;
    if (!chart) return;
    const points = chart.getElementsAtEventForMode(event.event, 'nearest', {intersect: true}, true);
    if (points.length) {
      const firstPoint = points[0];
      const label = chart.data.labels[firstPoint.index];
      console.log('Bar clicked:', label);
    }
  }


  transactionTrackBy = (tx: Transaction) => tx.id;


  transactionItemRender = (tx: Transaction) => `
  <div class="py-3 flex flex-col gap-1">
    <span class="font-semibold">${tx.name}</span>
    <span class="text-sm">Montant: <span class="font-mono">${tx.amount.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</span></span>
    <span class="text-xs text-base-content/60">Type: ${tx.typeTransactionRaw}</span>
  </div>
`;


  radarOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } },
    scales: { r: { beginAtZero: true } }
  };
  chartType: ChartType = "radar";

  chartClicked(event: { event?: any, active?: {}[] }): void {
    const chart = event.event?.chart;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(event.event, 'nearest', {intersect: true}, true);
    if (points.length) {
      const firstPoint = points[0];
      const label = chart.data.labels[firstPoint.index];

      if (label) {
        const dateIso = label.length === 10 ? `${label}T00:00:00Z` : label;

        this.selectedFilterDate.set(label);
        this.transactionService.search('dateTransaction', dateIso).subscribe({
          next: (txs) => {
            this.modalTransactions.set(txs ?? []);
            this.showModal.set(true);
          }
        });
      }
    }
  }


  closeModal() {
    this.showModal.set(false);
  }


  constructor(
    protected readonly transactionService: TransactionService,
    private readonly alert: AlertService
  ) {
    effect(() => {
      this.updateLineChart();
      this.updateBarChart();
      this.updateRadarChart();
      this.updatePieChart()
    });
    this.fetch();
  }


  fetch() {
    this.transactionService.fetch(this.page(), this.size()).subscribe({
      next: () => {
        this.updateBarChart();
      },
      error: () => {
        this.alert.show('Erreur lors de la récupération des transactions.', 'error');
      }
    });
  }

  nextPage() {
    if (this.page() + 1 < this.totalPages()) {
      this.page.set(this.page() + 1);
      this.fetch();
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.page.set(this.page() - 1);
      this.fetch();
    }
  }

  updateLineChart() {

    console.log('Filtre:', this.dateStart(), this.dateEnd());

    let txs = this.transactions();
    if (this.dateStart() || this.dateEnd()) {
      txs = txs.filter(t => {
        if (!t.dateTransaction) return false;
        const d = t.dateTransaction.substring(0, 10);
        const afterStart = this.dateStart() ? d >= this.dateStart()! : true;
        const beforeEnd = this.dateEnd() ? d <= this.dateEnd()! : true;
        return afterStart && beforeEnd;
      });
    }
     const group: Record<string, { in: number, out: number }> = {};
    txs.forEach(t => {
      if (!t.dateTransaction) return;
      const d = t.dateTransaction.substring(0, 10);
      if (!group[d]) group[d] = { in: 0, out: 0 };
      if (t.typeTransactionRaw === 'IN') group[d].in += t.amount;
      if (t.typeTransactionRaw === 'OUT') group[d].out += t.amount;
    });
    const dates = Object.keys(group).sort();
    const inValues = dates.map(d => group[d].in);
    const outValues = dates.map(d => group[d].out);
    this.lineLabels.set(dates);
    this.lineDatasets.set([
      {
        label: 'Entrées',
        data: inValues,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5
      },
      {
        label: 'Sorties',
        data: outValues,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220,38,38,0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5
      }
    ]);
  }


  onStartDateChange(date: string) {
    this.dateStart.set(date || null);
  }

  onEndDateChange(date: string) {
    this.dateEnd.set(date || null);
  }

  setCurrentMonth() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.dateStart.set(first.toISOString().substring(0, 10));
    this.dateEnd.set(last.toISOString().substring(0, 10));
  }

  resetSelectedDate() {
    this.fetch()
    this.selectedFilterDate.set(null);
    this.setCurrentMonth();
    this.updateLineChart();
  }


}
