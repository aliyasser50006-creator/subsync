import { Card, CardContent } from '@/components/ui/card';
import { JobWithMetadata, Category, Actor } from '@/lib/types/database';
import { Film, CheckCircle2, Loader2, AlertCircle, Tags, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface MediaManagerStatsProps {
  jobs: JobWithMetadata[];
  categories: Category[];
  actors: Actor[];
}

export const MediaManagerStats = memo(function MediaManagerStats({
  jobs,
  categories,
  actors,
}: MediaManagerStatsProps) {
  const stats = [
    {
      title: 'Total Videos',
      value: jobs.length,
      icon: Film,
      trend: '+12% this month',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Published',
      value: jobs.filter(j => j.status === 'ready' || j.status === 'done').length,
      icon: CheckCircle2,
      trend: 'All systems operational',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Processing',
      value: jobs.filter(j => j.status === 'processing' || j.status === 'pending').length,
      icon: Loader2,
      trend: 'Currently in queue',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      spin: true,
    },
    {
      title: 'Failed',
      value: jobs.filter(j => j.status === 'failed').length,
      icon: AlertCircle,
      trend: 'Requires attention',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: Tags,
      trend: 'Active tags',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Actors',
      value: actors.length,
      icon: Users,
      trend: 'Cast members',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="shadow-sm border-border/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded-lg", stat.bgColor, stat.color)}>
                <stat.icon className={cn("w-4 h-4", stat.spin && "animate-spin")} />
              </div>
              <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{stat.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.trend}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
