import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const STAKING_PERIODS = [
  { months: 1, rate: 30, label: '1 месяц - 30% годовых' },
  { months: 3, rate: 40, label: '3 месяца - 40% годовых' },
  { months: 6, rate: 50, label: '6 месяцев - 50% годовых' },
  { months: 12, rate: 60, label: '12 месяцев - 60% годовых' },
];

interface WalletStakingTabProps {
  stakingAmount: string;
  setStakingAmount: (value: string) => void;
  stakingPeriod: number;
  setStakingPeriod: (value: number) => void;
  stakings: any[];
  isProcessing: boolean;
  handleCreateStaking: () => void;
  handleClaimRewards: (stakingId: number) => void;
  handleCancelStaking: (stakingId: number) => void;
}

const calculateDailyReward = (amount: number, annualRate: number) => (amount * annualRate) / 36500;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status: string) => {
  if (status === 'completed') return <Badge className="bg-green-500">Выполнено</Badge>;
  if (status === 'active') return <Badge className="bg-blue-500">Активен</Badge>;
  if (status === 'cancelled') return <Badge variant="outline" className="bg-orange-100 text-orange-700">Отменен</Badge>;
  if (status === 'pending') return <Badge variant="secondary">В обработке</Badge>;
  if (status === 'failed') return <Badge variant="destructive">Ошибка</Badge>;
  return <Badge>{status}</Badge>;
};

export default function WalletStakingTab({
  stakingAmount,
  setStakingAmount,
  stakingPeriod,
  setStakingPeriod,
  stakings,
  isProcessing,
  handleCreateStaking,
  handleClaimRewards,
  handleCancelStaking
}: WalletStakingTabProps) {
  const selectedPeriod = STAKING_PERIODS.find(p => p.months === stakingPeriod);
  const amount = parseFloat(stakingAmount) || 0;
  const dailyReward = amount > 0 && selectedPeriod ? calculateDailyReward(amount, selectedPeriod.rate) : 0;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            Создать стейкинг
          </h3>

          <div className="space-y-2">
            <Label>Сумма CITY</Label>
            <Input type="number" step="0.01" placeholder="100" value={stakingAmount} onChange={(e) => setStakingAmount(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Период</Label>
            <Select value={stakingPeriod.toString()} onValueChange={(v) => setStakingPeriod(parseInt(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STAKING_PERIODS.map(p => (
                  <SelectItem key={p.months} value={p.months.toString()}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {dailyReward > 0 && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Ежедневный доход</p>
              <p className="text-2xl font-bold text-primary">{dailyReward.toFixed(4)} CITY</p>
              <p className="text-xs text-muted-foreground mt-1">≈ {(dailyReward * 30).toFixed(2)} CITY в месяц</p>
            </div>
          )}

          <Button className="w-full gap-2" onClick={handleCreateStaking} disabled={isProcessing || !stakingAmount || parseFloat(stakingAmount) <= 0}>
            <Icon name={isProcessing ? 'Loader2' : 'TrendingUp'} size={16} className={isProcessing ? 'animate-spin' : ''} />
            {isProcessing ? 'Обработка...' : 'Создать стейкинг'}
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Мои стейкинги</h3>
        {stakings.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-50" />
            <p>У вас пока нет стейкингов</p>
          </Card>
        ) : (
          stakings.map(staking => (
            <Card key={staking.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{staking.amount_city.toFixed(2)} CITY</p>
                    <p className="text-sm text-muted-foreground">{staking.period_months} мес. • {staking.annual_rate}% годовых</p>
                  </div>
                  {getStatusBadge(staking.status)}
                </div>

                {staking.total_earned > 0 && (
                  <div className="p-2 bg-green-500/10 border border-green-500/20 rounded">
                    <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                      Накоплено: {staking.total_earned.toFixed(4)} CITY
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Начало: {formatDate(staking.start_date)}</p>
                  <p>Окончание: {formatDate(staking.end_date)}</p>
                </div>

                {staking.status === 'active' && (
                  <div className="flex gap-2">
                    {staking.total_earned > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 gap-1" 
                        onClick={() => handleClaimRewards(staking.id)}
                        disabled={isProcessing}
                      >
                        <Icon name="Download" size={14} />
                        Забрать награды
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="flex-1 gap-1" 
                      onClick={() => handleCancelStaking(staking.id)}
                      disabled={isProcessing}
                    >
                      <Icon name="XCircle" size={14} />
                      Завершить досрочно
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
