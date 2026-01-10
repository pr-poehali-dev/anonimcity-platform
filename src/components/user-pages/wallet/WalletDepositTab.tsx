import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface WalletDepositTabProps {
  rates: { BTC: number; ETH: number; LTC: number };
  amountCrypto: string;
  setAmountCrypto: (value: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (value: string) => void;
  amountRub: number;
  isProcessing: boolean;
  handleDeposit: () => void;
}

export default function WalletDepositTab({
  rates,
  amountCrypto,
  setAmountCrypto,
  selectedCurrency,
  setSelectedCurrency,
  amountRub,
  isProcessing,
  handleDeposit
}: WalletDepositTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Button variant="outline" className="w-full gap-2 mb-4" onClick={() => window.open('https://casher.is/', '_blank')}>
          <Icon name="ArrowLeftRight" size={16} />
          Анонимный надежный обменник
        </Button>
        
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
              <Icon name="CircleDollarSign" size={16} className="text-blue-400" />
              <p className="font-medium text-sm">LTC</p>
            </div>
            <p className="text-sm font-bold">{rates.LTC.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Криптовалюта</Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
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
  );
}