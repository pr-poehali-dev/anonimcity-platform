import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface WalletExchangeTabProps {
  exchangeFrom: string;
  setExchangeFrom: (value: string) => void;
  exchangeAmount: string;
  setExchangeAmount: (value: string) => void;
  isProcessing: boolean;
  handleExchange: () => void;
}

export default function WalletExchangeTab({
  exchangeFrom,
  setExchangeFrom,
  exchangeAmount,
  setExchangeAmount,
  isProcessing,
  handleExchange
}: WalletExchangeTabProps) {
  return (
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
        </div>

        {exchangeAmount && parseFloat(exchangeAmount) > 0 && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Вы получите</p>
            <p className="text-2xl font-bold text-primary">{parseFloat(exchangeAmount).toFixed(2)} {exchangeFrom === 'RUB' ? 'CITY' : '₽'}</p>
          </div>
        )}

        <Button className="w-full gap-2" onClick={handleExchange} disabled={isProcessing || !exchangeAmount || parseFloat(exchangeAmount) <= 0}>
          <Icon name={isProcessing ? 'Loader2' : 'ArrowLeftRight'} size={16} className={isProcessing ? 'animate-spin' : ''} />
          {isProcessing ? 'Обработка...' : 'Обменять'}
        </Button>
      </div>
    </Card>
  );
}
