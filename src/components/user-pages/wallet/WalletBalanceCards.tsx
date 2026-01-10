import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WalletBalanceCardsProps {
  balanceRub: number;
  balanceCity: number;
  isLoading: boolean;
}

export default function WalletBalanceCards({ balanceRub, balanceCity, isLoading }: WalletBalanceCardsProps) {
  return (
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
  );
}
