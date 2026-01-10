import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface WalletHistoryTabProps {
  transactions: any[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = { deposit: 'Пополнение', withdrawal: 'Вывод', payment: 'Оплата', refund: 'Возврат', exchange: 'Обмен' };
  return labels[type] || type;
};

const getStatusBadge = (status: string) => {
  if (status === 'completed') return <Badge className="bg-green-500">Выполнено</Badge>;
  if (status === 'pending') return <Badge variant="secondary">В обработке</Badge>;
  if (status === 'failed') return <Badge variant="destructive">Ошибка</Badge>;
  return <Badge>{status}</Badge>;
};

export default function WalletHistoryTab({ transactions }: WalletHistoryTabProps) {
  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-50" />
          <p>История транзакций пуста</p>
        </Card>
      ) : (
        transactions.map(tx => (
          <Card key={tx.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{getTypeLabel(tx.type)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
              </div>
              {getStatusBadge(tx.status)}
            </div>

            {tx.description && (
              <p className="text-sm text-muted-foreground mb-2">{tx.description}</p>
            )}

            <div className="space-y-1 text-sm">
              {tx.amount_crypto && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Криптовалюта:</span>
                  <span className="font-medium">{tx.amount_crypto} {tx.crypto_currency}</span>
                </div>
              )}
              {tx.exchange_rate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Курс:</span>
                  <span className="font-medium">{tx.exchange_rate.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              {tx.amount_rub !== undefined && tx.amount_rub !== null && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Рубли:</span>
                  <span className="font-medium">{tx.amount_rub.toFixed(2)} ₽</span>
                </div>
              )}
              {tx.amount_city && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CITY:</span>
                  <span className="font-medium">{tx.amount_city.toFixed(2)} CITY</span>
                </div>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
