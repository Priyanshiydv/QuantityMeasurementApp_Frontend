import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuantityService } from '../../services/quantity.service';
import { QuantityInput, QuantityResponse } from '../../models/quantity';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  username   = '';
  userAvatar = '';

  selectedType = 'Length';
  selectedOp   = 'convert';
  loading      = false;

  value1     = 0;
  value2     = 0;
  unit1      = '';
  unit2      = '';
  targetUnit = '';

  showResult = false;
  result: QuantityResponse | null = null;

  unitsMap: { [key: string]: string[] } = {
    Length:      ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
    Weight:      ['KILOGRAM', 'GRAM', 'POUND'],
    Volume:      ['LITRE', 'MILLILITRE', 'GALLON'],
    Temperature: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
  };

  operations = [
    { key: 'convert',  icon: '🔄', name: 'Convert',  desc: 'Change unit'     },
    { key: 'compare',  icon: '⚖️', name: 'Compare',  desc: 'Check equality'  },
    { key: 'add',      icon: '➕', name: 'Add',      desc: 'Sum quantities'  },
    { key: 'subtract', icon: '➖', name: 'Subtract', desc: 'Find difference' },
    { key: 'divide',   icon: '➗', name: 'Divide',   desc: 'Scalar ratio'    }
  ];

  types = [
    { key: 'Length',      icon: '📐' },
    { key: 'Weight',      icon: '⚖️' },
    { key: 'Volume',      icon: '🧪' },
    { key: 'Temperature', icon: '🌡️' }
  ];

  // ── Stats Fields ──────────────────────────────────
  statsLoading    = true;
  totalOps        = 0;
  mostUsedOp      = '—';
  mostUsedType    = '—';
  lastOp          = '—';
  lastOpTime      = '—';

  constructor(
    private authService: AuthService,
    private quantityService: QuantityService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    // Username shown only if logged in
    const token = localStorage.getItem('accessToken');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.username   = this.authService.getUsername();
      this.userAvatar = this.username.charAt(0).toUpperCase();
      this.loadStats();
    } else {
      this.username   = 'Guest';
      this.userAvatar = 'G';
      this.statsLoading = false;
    }
    this.loadUnits('Length');
  }

 
  get units(): string[] {
    return this.unitsMap[this.selectedType] || [];
  }

  loadUnits(type: string): void {
    const units     = this.unitsMap[type] || [];
    this.unit1      = units[0] || '';
    this.unit2      = units[1] || '';
    this.targetUnit = units[0] || '';
    this.showResult = false;
  }

  selectType(type: string): void {
    this.selectedType = type;
    this.loadUnits(type);
  }

  selectOp(op: string): void {
    this.selectedOp = op;
    this.showResult = false;
  }

  swapValues(): void {
    [this.value1, this.value2] = [this.value2, this.value1];
    [this.unit1,  this.unit2]  = [this.unit2,  this.unit1];
  }

  calculate(): void {
    if (this.value1 === null || this.value1 === undefined) {
      this.toastService.error('Please enter value 1.');
      return;
    }

    this.loading    = true;
    this.showResult = false;

    const input: QuantityInput = {
      firstValue:            this.value1,
      firstUnit:             this.unit1,
      firstMeasurementType:  this.selectedType,
      secondValue:           this.value2,
      secondUnit:            this.unit2,
      secondMeasurementType: this.selectedType,
      targetUnit:            this.targetUnit || this.unit1
    };

    const opMap: { [key: string]: any } = {
      convert:  this.quantityService.convert(input),
      compare:  this.quantityService.compare(input),
      add:      this.quantityService.add(input),
      subtract: this.quantityService.subtract(input),
      divide:   this.quantityService.divide(input)
    };

    opMap[this.selectedOp].subscribe({
      next: (response: QuantityResponse) => {
        this.result     = response;
        this.showResult = true;
        this.loading    = false;
        this.toastService.success('Calculation completed!');
        this.loadStats();
      },
      error: () => {
        this.loading = false;
        this.toastService.error(
        'Calculation failed. Check backend is running.'
        );
      }
    });
  }

  getResultDisplay(): string {
    if (!this.result) return '—';
    if (this.result.resultString) return this.result.resultString.toUpperCase();
    if (this.result.resultValue !== undefined)
      return `${this.result.resultValue.toFixed(2)} ${this.result.resultUnit || ''}`;
    return '—';
  }

  signOut(): void {
    this.authService.signOut();
  }

  
  toggleTheme(): void {
    this.themeService.toggle();
  }

  getThemeIcon(): string {
    return this.themeService.getIcon();
  }

  getThemeLabel(): string {
    return this.themeService.getLabel();
  }

  // ── Load Stats ────────────────────────────────────
  loadStats(): void {
    this.statsLoading = true;

    this.historyService.getMyStats().subscribe({
      next: (items) => {
        this.totalOps = items.length;

        if (items.length === 0) {
          this.statsLoading = false;
          return;
        }

        // Most used operation
        const opCount: { [key: string]: number } = {};
        items.forEach(item => {
          const op = item.operation || 'UNKNOWN';
          opCount[op] = (opCount[op] || 0) + 1;
        });
        this.mostUsedOp = Object.entries(opCount)
          .sort((a, b) => b[1] - a[1])[0][0];

        // Most used measurement type
        const typeCount: { [key: string]: number } = {};
        items.forEach(item => {
          const t = item.firstMeasurementType || 'UNKNOWN';
          typeCount[t] = (typeCount[t] || 0) + 1;
        });
        this.mostUsedType = Object.entries(typeCount)
          .sort((a, b) => b[1] - a[1])[0][0];

        // Last operation
        const last = items[0];
        this.lastOp     = last.operation || '—';
        this.lastOpTime = last.timestamp
          ? this.timeAgo(last.timestamp)
          : '—';

        this.statsLoading = false;
      },
      error: () => {
        this.statsLoading = false;
      }
    });
  }

  // ── Time Ago Helper ───────────────────────────────
  timeAgo(timestamp: string): string {
    const now  = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor(
      (now.getTime() - then.getTime()) / 1000
    );

    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // ── Auth State ────────────────────────────────────
  isLoggedIn = false;
}