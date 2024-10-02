import { formatCurrency } from '@/lib/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { format } from 'date-fns';

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expenses = payload[1].value;

  let displayDate;
  try {
    displayDate = format(date, 'MMM dd, yyyy');
  } catch (e) {
    console.log(date);
    displayDate = 'invalid';
  }

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">{displayDate}</div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items center gap-x-2">
            <div className="size-1.5 bg-blue-500 rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-sm text-right font-medium">{formatCurrency(income)}</p>
        </div>
      </div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items center gap-x-2">
            <div className="size-1.5 bg-red-500 rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">{formatCurrency(expenses)}</p>
        </div>
      </div>
    </div>
  );
};
