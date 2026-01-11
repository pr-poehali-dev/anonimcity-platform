import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import CryptoPaymentDialog from '@/components/CryptoPaymentDialog';

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
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const predefinedAmounts = [500, 1000, 5000, 10000];

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Bitcoin" size={20} className="text-primary" />
              Пополнить кошелек криптовалютой
            </h3>
            <p className="text-sm text-muted-foreground">
              Выберите сумму пополнения в рублях. Вы сможете оплатить BTC, ETH или LTC
            </p>
          </div>

          <div className="space-y-3">
            <Label>Сумма пополнения</Label>
            <div className="grid grid-cols-2 gap-2">
              {predefinedAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant={depositAmount === String(amount) ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => setDepositAmount(String(amount))}
                >
                  {amount.toLocaleString('ru-RU')} ₽
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Или введите свою сумму</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="1000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="100"
              />
              <p className="text-xs text-muted-foreground">Минимальная сумма: 100 ₽</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon name="Bitcoin" size={16} className="text-orange-500" />
                <p className="font-medium text-sm">BTC</p>
              </div>
              <p className="text-xs font-bold">{rates.BTC.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon name="Hexagon" size={16} className="text-purple-500" />
                <p className="font-medium text-sm">ETH</p>
              </div>
              <p className="text-xs font-bold">{rates.ETH.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon name="CircleDollarSign" size={16} className="text-blue-400" />
                <p className="font-medium text-sm">LTC</p>
              </div>
              <p className="text-xs font-bold">{rates.LTC.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>

          {depositAmount && parseFloat(depositAmount) >= 100 && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">К пополнению</p>
              <p className="text-2xl font-bold text-primary">
                {parseFloat(depositAmount).toLocaleString('ru-RU')} ₽
              </p>
            </div>
          )}

          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setShowCryptoPayment(true)}
            disabled={!depositAmount || parseFloat(depositAmount) < 100}
          >
            <Icon name="ArrowRight" size={16} />
            Продолжить к оплате
          </Button>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full gap-2" 
              onClick={() => window.open('https://casher.is/', '_blank')}
            >
              <Icon name="ArrowLeftRight" size={16} />
              Обменник криптовалют
            </Button>
          </div>
        </div>
      </Card>

      <CryptoPaymentDialog
        isOpen={showCryptoPayment}
        onClose={() => setShowCryptoPayment(false)}
        amountRub={parseFloat(depositAmount) || 0}
        onPaymentComplete={(invoiceId) => {
          console.log('Payment invoice created:', invoiceId);
          setShowCryptoPayment(false);
          setDepositAmount('');
        }}
      />
    </>
  );
}