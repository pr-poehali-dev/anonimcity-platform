import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export default function WalletPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Кошелек</h1>
        
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Баланс</h2>
                <Icon name="Bitcoin" size={24} className="text-primary" />
              </div>
              <p className="text-4xl font-bold">0.0000 BTC</p>
              <p className="text-muted-foreground">≈ 0.00 ₽</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Пополнить кошелек</h3>
              <div className="space-y-2">
                <Label>Сумма BTC</Label>
                <Input placeholder="0.001" />
              </div>
              <Button className="w-full gap-2">
                <Icon name="Download" size={16} />
                Пополнить
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">История транзакций</h3>
            <div className="text-center text-muted-foreground py-8">
              <Icon name="History" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Нет транзакций</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
