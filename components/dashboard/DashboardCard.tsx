import { Card } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value?: string | number;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardCard({ title, value, description, children }: DashboardCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {value !== undefined && (
          <p className="text-2xl font-bold text-foreground">{value}</p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
}