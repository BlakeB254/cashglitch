interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="bg-primary/10 border border-primary/25 p-6 rounded">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-primary/70 font-tech uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-matrix text-primary mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-primary/50 font-tech mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className="w-8 h-8 text-primary/50" />
      </div>
    </div>
  );
}
