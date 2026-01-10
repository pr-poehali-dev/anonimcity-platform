import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import WalletBalanceCards from './wallet/WalletBalanceCards';
import WalletDepositTab from './wallet/WalletDepositTab';
import WalletExchangeTab from './wallet/WalletExchangeTab';
import WalletStakingTab from './wallet/WalletStakingTab';
import WalletHistoryTab from './wallet/WalletHistoryTab';

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
  const [rates, setRates] = useState<{ BTC: number; ETH: number; LTC: number }>({ BTC: 0, ETH: 0, LTC: 0 });
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
      setRates(data.rates || { BTC: 0, ETH: 0, LTC: 0 });
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

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Кошелек</h1>
        
        <div className="space-y-6">
          <WalletBalanceCards 
            balanceRub={balanceRub}
            balanceCity={balanceCity}
            isLoading={isLoading}
          />

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deposit">Пополнить</TabsTrigger>
              <TabsTrigger value="exchange">Обмен</TabsTrigger>
              <TabsTrigger value="staking">Стейкинг</TabsTrigger>
              <TabsTrigger value="history">История</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <WalletDepositTab
                rates={rates}
                amountCrypto={amountCrypto}
                setAmountCrypto={setAmountCrypto}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                amountRub={amountRub}
                isProcessing={isProcessing}
                handleDeposit={handleDeposit}
              />
            </TabsContent>

            <TabsContent value="exchange" className="space-y-4">
              <WalletExchangeTab
                exchangeFrom={exchangeFrom}
                setExchangeFrom={setExchangeFrom}
                exchangeAmount={exchangeAmount}
                setExchangeAmount={setExchangeAmount}
                isProcessing={isProcessing}
                handleExchange={handleExchange}
              />
            </TabsContent>

            <TabsContent value="staking" className="space-y-4">
              <WalletStakingTab
                stakingAmount={stakingAmount}
                setStakingAmount={setStakingAmount}
                stakingPeriod={stakingPeriod}
                setStakingPeriod={setStakingPeriod}
                stakings={stakings}
                isProcessing={isProcessing}
                handleCreateStaking={handleCreateStaking}
                handleClaimRewards={handleClaimRewards}
                handleCancelStaking={handleCancelStaking}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <WalletHistoryTab transactions={transactions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
