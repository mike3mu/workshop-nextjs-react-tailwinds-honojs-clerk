'use client';

import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Chart } from './charts';

export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <Chart data={data?.days} />
    </div>
  );
};
