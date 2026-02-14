import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const variantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export default function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm border border-border/50 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", variantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}
