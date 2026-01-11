import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import QRCode from 'react-qr-code';

interface CryptoPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  amountRub: number;
  listingId?: number;
  onPaymentComplete?: (invoiceId: string) => void;
}

interface Invoice {
  invoice_id: string;
  payment_address: string;
  crypto_currency: string;
  amount_crypto: number;
  amount_rub: number;
  exchange_rate: number;
  status: string;
}

export default function CryptoPaymentDialog({ 
  isOpen, 
  onClose, 
  amountRub, 
  listingId,
  onPaymentComplete 
}: CryptoPaymentDialogProps) {
  const [cryptoCurrency, setCryptoCurrency] = useState<string>('BTC');
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin (BTC)', icon: '₿' },
    { value: 'ETH', label: 'Ethereum (ETH)', icon: 'Ξ' },
    { value: 'LTC', label: 'Litecoin (LTC)', icon: 'Ł' }
  ];

  const createInvoice = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://functions.poehali.dev/2441db33-301a-4fc0-8562-c375664cb244?action=create_invoice',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': localStorage.getItem('user_id') || '1'
          },
          body: JSON.stringify({
            crypto_currency: cryptoCurrency,
            amount_rub: amountRub,
            listing_id: listingId
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setInvoice(data);
      } else {
        setError(data.error || 'Ошибка создания счета');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !invoice) {
      createInvoice();
    }
  }, [isOpen, cryptoCurrency]);

  const handleCopyAddress = () => {
    if (invoice?.payment_address) {
      navigator.clipboard.writeText(invoice.payment_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCurrencyChange = (value: string) => {
    setCryptoCurrency(value);
    setInvoice(null);
  };

  const selectedCrypto = cryptoOptions.find(c => c.value === cryptoCurrency);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Icon name="Bitcoin" size={20} className="text-primary" />
            Оплата криптовалютой
          </DialogTitle>
          <DialogDescription className="text-xs">
            Выберите криптовалюту и отправьте точную сумму
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Выбор валюты */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите криптовалюту</label>
            <Select value={cryptoCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <Card className="p-8 text-center">
              <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Генерация счета...</p>
            </Card>
          )}

          {error && (
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex items-center gap-2 text-destructive">
                <Icon name="AlertCircle" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </Card>
          )}

          {invoice && !isLoading && (
            <>
              {/* Сумма к оплате */}
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground">Сумма к оплате</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedCrypto?.icon} {invoice.amount_crypto.toFixed(8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ≈ {invoice.amount_rub} ₽
                  </p>
                </div>
              </Card>

              {/* QR код */}
              <Card className="p-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCode 
                      value={invoice.payment_address} 
                      size={150}
                      level="M"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Отсканируйте QR-код
                  </p>
                </div>
              </Card>

              {/* Адрес для оплаты */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Адрес для оплаты</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted p-2 rounded-lg break-all text-xs font-mono">
                    {invoice.payment_address}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyAddress}
                    className="flex-shrink-0 h-8 w-8"
                  >
                    <Icon name={copied ? "Check" : "Copy"} size={14} />
                  </Button>
                </div>
              </div>

              {/* Предупреждения */}
              <Card className="p-3 bg-amber-500/10 border-amber-500/30">
                <div className="flex gap-2">
                  <Icon name="AlertTriangle" size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-medium text-amber-700 dark:text-amber-400">
                      Важно:
                    </p>
                    <ul className="space-y-0.5 text-muted-foreground">
                      <li>• Точная сумма {invoice.amount_crypto.toFixed(8)} {invoice.crypto_currency}</li>
                      <li>• Только сеть {invoice.crypto_currency}</li>
                      <li>• Активация после 1 подтверждения</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Статус */}
              <Card className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Ожидание оплаты</span>
                  </div>
                  <span className="text-xs text-muted-foreground">ID: {invoice.invoice_id.slice(0, 8)}...</span>
                </div>
              </Card>
            </>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1" size="sm">
              Закрыть
            </Button>
            {invoice && (
              <Button 
                className="flex-1 gap-1" 
                size="sm"
                onClick={() => window.open(`https://blockchain.info/address/${invoice.payment_address}`, '_blank')}
              >
                <Icon name="ExternalLink" size={14} />
                Проверить
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}