import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { getExchangeRates, getWalletBalance, getWalletTransactions, depositToWallet } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface WalletPageProps {
  generatedCredentials: { login: string; password: string; user_id?: number } | null;
}

export default function WalletPage({ generatedCredentials }: WalletPageProps) {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [rates, setRates] = useState<{ BTC: number; ETH: number; USDT: number }>({ BTC: 0, ETH: 0, USDT: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  
  const [amountCrypto, setAmountCrypto] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [amountRub, setAmountRub] = useState(0);

  useEffect(() => {
    loadWalletData();
    loadExchangeRates();
    const interval = setInterval(loadExchangeRates, 60000); // Обновляем курсы каждую минуту
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
      const [balanceData, transactionsData] = await Promise.all([
        getWalletBalance(generatedCredentials.user_id),
        getWalletTransactions(generatedCredentials.user_id)
      ]);
      
      setBalance(balanceData.balance_rub || 0);
      setTransactions(transactionsData || []);
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
    if (!generatedCredentials?.user_id) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо авторизоваться',
        variant: 'destructive',
      });
      return;
    }

    const crypto = parseFloat(amountCrypto);
    if (!crypto || crypto <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }

    setIsDepositing(true);
    try {
      const result = await depositToWallet(
        generatedCredentials.user_id,
        crypto,
        selectedCurrency
      );

      if (result.success && result.data) {
        toast({
          title: 'Баланс пополнен!',
          description: `Зачислено ${result.data.amount_rub.toFixed(2)} ₽ по курсу ${result.data.exchange_rate.toFixed(2)} ₽/${selectedCurrency}`,
        });
        
        setAmountCrypto('');
        setAmountRub(0);
        await loadWalletData();
      } else {
        toast({
          title: 'Ошибка',
          description: result.error || 'Не удалось пополнить баланс',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить операцию',
        variant: 'destructive',
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Пополнение',
      withdrawal: 'Вывод',
      payment: 'Оплата',
      refund: 'Возврат',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Выполнено</Badge>;
      case 'pending':
        return <Badge variant="secondary">В обработке</Badge>;
      case 'failed':
        return <Badge variant="destructive">Ошибка</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Кошелек</h1>
        
        <div className="space-y-6">
          {/* Баланс */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Баланс</h2>
                <Icon name="Wallet" size={24} className="text-primary" />
              </div>
              {isLoading ? (
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              ) : (
                <>
                  <p className="text-4xl font-bold">{balance.toFixed(2)} ₽</p>
                  <p className="text-sm text-muted-foreground">Рублевый баланс</p>
                </>
              )}
            </div>
          </Card>

          {/* Актуальные курсы */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Icon name="TrendingUp" size={20} />
              Текущие курсы
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon name="Bitcoin" size={16} className="text-orange-500" />
                  <p className="font-medium text-sm">BTC</p>
                </div>
                <p className="text-lg font-bold">{rates.BTC.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon name="Hexagon" size={16} className="text-purple-500" />
                  <p className="font-medium text-sm">ETH</p>
                </div>
                <p className="text-lg font-bold">{rates.ETH.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon name="DollarSign" size={16} className="text-green-500" />
                  <p className="font-medium text-sm">USDT</p>
                </div>
                <p className="text-lg font-bold">{rates.USDT.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </Card>

          {/* Пополнение */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="Download" size={20} />
                Пополнить кошелек
              </h3>
              
              <div className="space-y-2">
                <Label>Криптовалюта</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Сумма</Label>
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.001"
                  value={amountCrypto}
                  onChange={(e) => setAmountCrypto(e.target.value)}
                />
              </div>

              {amountCrypto && amountRub > 0 && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Будет зачислено</p>
                  <p className="text-2xl font-bold text-primary">{amountRub.toFixed(2)} ₽</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Курс: {rates[selectedCurrency as keyof typeof rates].toLocaleString('ru-RU')} ₽/{selectedCurrency}
                  </p>
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleDeposit}
                disabled={isDepositing || !amountCrypto || parseFloat(amountCrypto) <= 0}
              >
                <Icon name={isDepositing ? 'Loader2' : 'Download'} size={16} className={isDepositing ? 'animate-spin' : ''} />
                {isDepositing ? 'Обработка...' : 'Пополнить'}
              </Button>
            </div>
          </Card>

          {/* История транзакций */}
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
                        {tx.description && (
                          <p className="text-sm text-muted-foreground">{tx.description}</p>
                        )}
                        {tx.amount_crypto && tx.crypto_currency && (
                          <p className="text-xs text-muted-foreground">
                            {tx.amount_crypto} {tx.crypto_currency} • Курс: {tx.exchange_rate?.toLocaleString('ru-RU')} ₽
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'}{tx.amount_rub.toFixed(2)} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
