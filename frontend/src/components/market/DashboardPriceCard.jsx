import { ArrowDownRight, ArrowUpRight, ChartNoAxesCombined } from 'lucide-react';
import Card from '../ui/Card';

export default function DashboardPriceCard({ price, changePercent, woolType, state }) {
  const rising = Number(changePercent) >= 0;
  const TrendIcon = rising ? ArrowUpRight : ArrowDownRight;
  return <Card className="market-highlight border-0"><div className="flex items-start justify-between"><div><div className="metric-icon bg-infoLight text-info"><ChartNoAxesCombined size={21}/></div><p className="mt-4 text-xs font-semibold uppercase tracking-[.09em] text-textSecondary">Market pulse</p><strong className="mt-1 block text-2xl font-bold tracking-tight">Rs. {price}<small className="ml-1 text-sm font-medium text-textSecondary">/kg</small></strong><span className="mt-2 block text-xs text-textMuted">{woolType} · {state}</span></div><span className={`trend-chip ${rising ? 'trend-up' : 'trend-down'}`}><TrendIcon size={15}/>{Math.abs(Number(changePercent || 0))}%</span></div></Card>;
}
