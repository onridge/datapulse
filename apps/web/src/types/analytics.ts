export interface AnalyticsStats {
  mrr: number;
  mrrChange: number;
  churnRate: number;
  churnChange: number;
  retention: number;
  retentionChange: number;
  ltv: number;
  ltvChange: number;
}

export interface TrendPoint {
  month: string;
  current: number;
  previous: number;
}

export interface FunnelItem {
  label: string;
  value: number;
  pct: number;
  color: string;
}

export interface TopPage {
  page: string;
  views: number;
  bounce: number;
  bouncePos: boolean;
  avgTime: string;
}

export interface TrafficItem {
  label: string;
  pct: number;
  color: string;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  trend: TrendPoint[];
  funnel: FunnelItem[];
  topPages: TopPage[];
  traffic: TrafficItem[];
}
