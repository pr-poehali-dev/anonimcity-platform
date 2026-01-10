import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { 
  getExchangeRates, 
  getWalletBalance, 
  getWalletTransactions, 
  depositToWallet,
  exchangeCurrency,
  createStaking,
  getStakingList,
  claimStakingRewards,
  cancelStakingEarly
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface WalletPageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

const STAKING_PERIODS = [
  { months: 1, rate: 30, label: '1 месяц - 30% годовых' },
  { months: 3, rate: 40, label: '3 месяца - 40% годовых' },
  { months: 6, rate: 50, label: '6 месяцев - 50% годовых' },
  { months: 12, rate: 60, label: '12 месяцев - 60% годовых' },
];

export default function WalletPage({ generatedCredentials }: WalletPageProps) {
  const { toast } = useToast();
  const [balanceRub, setBalanceRub] = useState(0);
  const [balanceCity, setBalanceCity] = useState(0);
  const [rates, setRates] = useState<{ BTC: number; ETH: number; USDT: number }>({ BTC: 0, ETH: 0, USDT: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stakings, setStakings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [amountCrypto, setAmountCrypto] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [amountRub, setAmountRub] = useState(0);
  const [exchangeFrom, setExchangeFrom] = useState('RUB');
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [stakingAmount, setStakingAmount] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState(1);

  useEffect(() => {
    loadWalletData();
    loadExchangeRates();
    const interval = setInterval(loadExchangeRates, 60000);
    return () => clearInterval(interval);
  }, [generatedCredentials]);

  useEffect(() => {
    const crypto = parseFloat(amountCrypto) || 0;
    const rate = rates[selectedCurrency as keyof typeof rates] || 0;
    setAmountRub(crypto * rate);
  }, [amountCrypto, selectedCurrency, rates]);

  const loadWalletData = async () => {
    if (!generatedCredentials?.user_id) return;
    
    setIsLoading(true);
    try {
      const [balanceData, transactionsData, stakingsData] = await Promise.all([
        getWalletBalance(generatedCredentials.user_id),
        getWalletTransactions(generatedCredentials.user_id),
        getStakingList(generatedCredentials.user_id)
      ]);
      
      setBalanceRub(balanceData.balance_rub || 0);
      setBalanceCity(balanceData.balance_city || 0);
      setTransactions(transactionsData || []);
      setStakings(stakingsData || []);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExchangeRates = async () => {
    try {
      const data = await getExchangeRates();
      setRates(data.rates || { BTC: 0, ETH: 0, USDT: 0 });
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    }
  };

  const handleDeposit = async () => {
    if (!generatedCredentials?.user_id) return;

    const crypto = parseFloat(amountCrypto);
    if (!crypto || crypto <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await depositToWallet(generatedCredentials.user_id, crypto, selectedCurrency);

      if (result.success && result.data) {
        toast({ title: 'Баланс пополнен!', description: `Зачислено ${result.data.amount_rub.toFixed(2)} ₽` });
        setAmountCrypto('');
        setAmountRub(0);
        await loadWalletData();
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Не удалось пополнить баланс', variant: 'destructive' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExchange = async () => {
    if (!generatedCredentials?.user_id) return;

    const amount = parseFloat(exchangeAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await exchangeCurrency(generatedCredentials.user_id, exchangeFrom, amount);

      if (result.success) {
        toast({ title: 'Обмен выполнен!', description: `${amount} ${exchangeFrom} ${exchangeFrom === 'RUB' ? '→' : '←'} ${exchangeFrom === 'RUB' ? 'CITY' : 'RUB'}` });
        setExchangeAmount('');
        await loadWalletData();
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Не удалось выполнить обмен', variant: 'destructive' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateStaking = async () => {
    if (!generatedCredentials?.user_id) return;

    const amount = parseFloat(stakingAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createStaking(generatedCredentials.user_id, amount, stakingPeriod);

      if (result.success) {
        const period = STAKING_PERIODS.find(p => p.months === stakingPeriod);
        toast({ title: 'Стейкинг создан!', description: `${amount} CITY заблокировано на ${stakingPeriod} мес. под ${period?.rate}% годовых` });
        setStakingAmount('');
        await loadWalletData();
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Не удалось создать стейкинг', variant: 'destructive' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimRewards = async (stakingId: number) => {
    if (!generatedCredentials?.user_id) return;

    setIsProcessing(true);
    try {
      const result = await claimStakingRewards(generatedCredentials.user_id, stakingId);

      if (result.success && result.data) {
        toast({ title: 'Награды получены!', description: `Получено ${result.data.claimed_amount.toFixed(2)} CITY` });
        await loadWalletData();
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Не удалось получить награды', variant: 'destructive' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelStaking = async (stakingId: number) => {
    if (!generatedCredentials?.user_id) return;

    if (!confirm('Досрочное завершение приведет к потере 50% процентов. Продолжить?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await cancelStakingEarly(generatedCredentials.user_id, stakingId);

      if (result.success && result.data) {
        toast({ 
          title: 'Стейкинг завершен досрочно', 
          description: `Возвращено ${result.data.returned_amount.toFixed(2)} CITY. Штраф: ${result.data.penalty_amount.toFixed(2)} CITY` 
        });
        await loadWalletData();
      } else {
        toast({ title: 'Ошибка', description: result.error || 'Не удалось завершить стейкинг', variant: 'destructive' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { deposit: 'Пополнение', withdrawal: 'Вывод', payment: 'Оплата', refund: 'Возврат', exchange: 'Обмен' };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <Badge className="bg-green-500">Выполнено</Badge>;
    if (status === 'active') return <Badge className="bg-blue-500">Активен</Badge>;
    if (status === 'cancelled') return <Badge variant="outline" className="bg-orange-100 text-orange-700">Отменен</Badge>;
    if (status === 'pending') return <Badge variant="secondary">В обработке</Badge>;
    if (status === 'failed') return <Badge variant="destructive">Ошибка</Badge>;
    return <Badge>{status}</Badge>;
  };

  const calculateDailyReward = (amount: number, annualRate: number) => (amount * annualRate) / 36500;

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Кошелек</h1>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Рубли</h2>
                  <Icon name="Wallet" size={24} className="text-blue-500" />
                </div>
                {isLoading ? <Icon name="Loader2" size={32} className="animate-spin text-blue-500" /> : (
                  <>
                    <p className="text-4xl font-bold">{balanceRub.toFixed(2)} ₽</p>
                    <p className="text-sm text-muted-foreground">Рублевый баланс</p>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">CITY</h2>
                  <Icon name="Coins" size={24} className="text-amber-500" />
                </div>
                {isLoading ? <Icon name="Loader2" size={32} className="animate-spin text-amber-500" /> : (
                  <>
                    <p className="text-4xl font-bold">{balanceCity.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">1 CITY = 1 ₽</p>
                  </>
                )}
              </div>
            </Card>
          </div>

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deposit">Пополнить</TabsTrigger>
              <TabsTrigger value="exchange">Обмен</TabsTrigger>
              <TabsTrigger value="staking">Стейкинг</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="Download" size={20} />
                    Пополнить кошелек криптовалютой
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon name="Bitcoin" size={16} className="text-orange-500" />
                        <p className="font-medium text-sm">BTC</p>
                      </div>
                      <p className="text-sm font-bold">{rates.BTC.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon name="Hexagon" size={16} className="text-purple-500" />
                        <p className="font-medium text-sm">ETH</p>
                      </div>
                      <p className="text-sm font-bold">{rates.ETH.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon name="DollarSign" size={16} className="text-green-500" />
                        <p className="font-medium text-sm">USDT</p>
                      </div>
                      <p className="text-sm font-bold">{rates.USDT.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Криптовалюта</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Сумма</Label>
                    <Input type="number" step="0.00000001" placeholder="0.001" value={amountCrypto} onChange={(e) => setAmountCrypto(e.target.value)} />
                  </div>

                  {amountCrypto && amountRub > 0 && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Будет зачислено</p>
                      <p className="text-2xl font-bold text-primary">{amountRub.toFixed(2)} ₽</p>
                    </div>
                  )}

                  <Button className="w-full gap-2" onClick={handleDeposit} disabled={isProcessing || !amountCrypto || parseFloat(amountCrypto) <= 0}>
                    <Icon name={isProcessing ? 'Loader2' : 'Download'} size={16} className={isProcessing ? 'animate-spin' : ''} />
                    {isProcessing ? 'Обработка...' : 'Пополнить'}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="exchange" className="space-y-4">
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="ArrowLeftRight" size={20} />
                    Обмен валюты (1 CITY = 1 ₽)
                  </h3>

                  <div className="space-y-2">
                    <Label>Обменять</Label>
                    <Select value={exchangeFrom} onValueChange={setExchangeFrom}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">Рубли (₽) → CITY</SelectItem>
                        <SelectItem value="CITY">CITY → Рубли (₽)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Сумма</Label>
                    <Input type="number" step="0.01" placeholder="100" value={exchangeAmount} onChange={(e) => setExchangeAmount(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Доступно: {exchangeFrom === 'RUB' ? `${balanceRub.toFixed(2)} ₽` : `${balanceCity.toFixed(2)} CITY`}</p>
                  </div>

                  <Button className="w-full gap-2" onClick={handleExchange} disabled={isProcessing || !exchangeAmount || parseFloat(exchangeAmount) <= 0}>
                    <Icon name={isProcessing ? 'Loader2' : 'ArrowLeftRight'} size={16} className={isProcessing ? 'animate-spin' : ''} />
                    {isProcessing ? 'Обработка...' : 'Обменять'}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="staking" className="space-y-4">
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Создать стейкинг
                  </h3>

                  <div className="space-y-2">
                    <Label>Период</Label>
                    <Select value={String(stakingPeriod)} onValueChange={(v) => setStakingPeriod(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STAKING_PERIODS.map(p => <SelectItem key={p.months} value={String(p.months)}>{p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Сумма CITY</Label>
                    <Input type="number" step="0.01" placeholder="1000" value={stakingAmount} onChange={(e) => setStakingAmount(e.target.value)} />
                    <p className="text-xs text-muted-foreground">Доступно: {balanceCity.toFixed(2)} CITY</p>
                  </div>

                  {stakingAmount && parseFloat(stakingAmount) > 0 && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">Ежедневный доход</p>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateDailyReward(parseFloat(stakingAmount), STAKING_PERIODS.find(p => p.months === stakingPeriod)?.rate || 0).toFixed(4)} CITY
                      </p>
                    </div>
                  )}

                  <Button className="w-full gap-2" onClick={handleCreateStaking} disabled={isProcessing || !stakingAmount || parseFloat(stakingAmount) <= 0}>
                    <Icon name={isProcessing ? 'Loader2' : 'Lock'} size={16} className={isProcessing ? 'animate-spin' : ''} />
                    {isProcessing ? 'Обработка...' : 'Заблокировать'}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Мои стейкинги</h3>
                {stakings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">Нет активных стейкингов</p>
                ) : (
                  <div className="space-y-3">
                    {stakings.map((staking) => (
                      <div key={staking.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-lg">{staking.amount_city.toFixed(2)} CITY</p>
                            <p className="text-sm text-muted-foreground">{staking.period_months} мес. • {staking.annual_rate}% годовых</p>
                          </div>
                          {getStatusBadge(staking.status)}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Начислено: <span className="font-bold text-green-600">{staking.total_earned.toFixed(4)} CITY</span>
                          </p>
                          <p className="text-muted-foreground">Завершение: {formatDate(staking.end_date)}</p>
                        </div>
                        {staking.status === 'active' && (
                          <div className="flex gap-2 mt-3">
                            {staking.total_earned > 0 && (
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleClaimRewards(staking.id)} disabled={isProcessing}>
                                <Icon name="Gift" size={14} />
                                Забрать награды
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleCancelStaking(staking.id)} disabled={isProcessing}>
                              <Icon name="XCircle" size={14} />
                              Завершить досрочно
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="History" size={20} />
                  История транзакций
                </h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary mb-2" />
                    <p className="text-muted-foreground">Загрузка...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="History" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Нет транзакций</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{getTypeLabel(tx.type)}</p>
                              {getStatusBadge(tx.status)}
                            </div>
                            {tx.description && <p className="text-sm text-muted-foreground">{tx.description}</p>}
                            <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                          </div>
                          <div className="text-right">
                            {tx.amount_rub && (
                              <p className="text-lg font-bold">{tx.type === 'deposit' || tx.type === 'refund' ? '+' : ''}{tx.amount_rub.toFixed(2)} ₽</p>
                            )}
                            {tx.amount_city && (
                              <p className="text-sm text-amber-600 font-semibold">{tx.type === 'exchange' && tx.description?.includes('CITY →') ? '' : '+'}{tx.amount_city.toFixed(2)} CITY</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}