import Card from '../ui/Card';

export default function PriceCard({
  price,
  pricePerKg,
  changePercent,
  woolType,
  state,
}) {
  const actualPrice = price ?? pricePerKg ?? 0;
  const change = Number(changePercent || 0);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-textSecondary text-[13px]">
            {woolType || 'Wool'} · {state || 'India'}
          </p>

          <p className="text-2xl font-bold text-textPrimary mt-1">
            ₹{actualPrice}/kg
          </p>

          <p
            className={`text-sm font-semibold mt-1 ${
              change >= 0 ? 'text-success' : 'text-error'
            }`}
          >
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </p>
        </div>

        <div className="text-right">
          <p className="text-textMuted text-xs">Market Price</p>
          <p className="text-textSecondary text-xs mt-1">
            Current rate
          </p>
        </div>
      </div>
    </Card>
  );
}