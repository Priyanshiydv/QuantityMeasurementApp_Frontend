import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { HistoryItem } from '../../models/quantity';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  username   = '';
  userAvatar = '';

  historyMode = 'my'; // 'my' or 'all'
  filterBy    = 'all';
  filterValue = '';
  loading     = false;
  countText   = '';

  historyItems: HistoryItem[] = [];

  filterOptions: { [key: string]: string[] } = {
    operation:   ['COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE'],
    measurement: ['Length', 'Weight', 'Volume', 'Temperature']
  };

  badgeColors: { [key: string]: string } = {
    COMPARE:  'rgba(56,189,248,0.15)',
    CONVERT:  'rgba(129,140,248,0.15)',
    ADD:      'rgba(52,211,153,0.15)',
    SUBTRACT: 'rgba(251,146,60,0.15)',
    DIVIDE:   'rgba(240,165,0,0.15)'
  };

  textColors: { [key: string]: string } = {
    COMPARE:  '#38bdf8',
    CONVERT:  '#818cf8',
    ADD:      '#34d399',
    SUBTRACT: '#fb923c',
    DIVIDE:   '#f0a500'
  };

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.username   = this.authService.getUsername();
    this.userAvatar = this.username.charAt(0).toUpperCase();
    this.fetchHistory();
  }

  // ── Update Filter Options ─────────────────────────
  updateFilterOptions(): void {
    this.filterValue = '';
  }

  // ── Fetch History ─────────────────────────────────
  fetchHistory(): void {
    this.loading      = true;
    this.historyItems = [];
    this.countText    = '';

    let obs;

      if (this.filterBy === 'operation' && this.filterValue) {
        obs = this.historyService.getByOperation(this.filterValue);
      } else if (this.filterBy === 'measurement' && this.filterValue) {
        obs = this.historyService.getByMeasurement(this.filterValue);
      } else {
        obs = this.historyService.getMyHistory();
      }
      obs.subscribe({
        next: (items) => {
          this.historyItems = items;
          this.loading      = false;
          },
          error: () => {
            this.loading = false;
          }
        });
  }

  // ── Get Count ─────────────────────────────────────
  getCount(): void {
    this.loading = true;

    //get users own history
    let obs;
    if(this.filterBy === 'operation' && this.filterValue) {
      obs = this.historyService.getByOperation(this.filterValue);
    } else if (this.filterBy === 'measurement' && this.filterValue){
      obs = this.historyService.getByMeasurement(this.filterValue);
    } else {
      obs = this.historyService.getMyHistory();
    }
    obs.subscribe({
      next: (items) => {
        this.countText = `Total: ${items.length} record(s)`;
        this.loading = false;
      },
      error: () => {
        this.countText = 'Could not fetch count.';
        this.loading = false;
      }
    });
  }

  // ── Format History Detail ─────────────────────────
  getDetail(item: HistoryItem): string {
    const input1 = item.firstUnit  || '';
    const input2 = item.secondUnit || '';
    const result = item.resultString || '—';

    if (input1 && input2) return `${input1} ↔ ${input2} → ${result}`;
    if (input1)           return `${input1} → ${result}`;
    return `Result: ${result}`;
  }

  // ── Badge Style ───────────────────────────────────
  getBadgeStyle(op: string): object {
    const key = op.toUpperCase();
    return {
      background: this.badgeColors[key] || 'rgba(56,189,248,0.15)',
      color:      this.textColors[key]  || '#38bdf8',
      border:     `1px solid ${this.textColors[key] || '#38bdf8'}`
    };
  }

  // ── Format Time ───────────────────────────────────
  formatTime(timestamp: string): string {
    return timestamp ? new Date(timestamp).toLocaleString() : '';
  }

  // ── Sign Out ──────────────────────────────────────
  signOut(): void {
    this.authService.signOut();
  }

  get currentFilterOptions(): string[] {
    return this.filterOptions[this.filterBy] || [];
  }

  toggleTheme(): void { this.themeService.toggle(); }
  getThemeIcon(): string { return this.themeService.getIcon(); }
  getThemeLabel(): string { return this.themeService.getLabel(); }
}