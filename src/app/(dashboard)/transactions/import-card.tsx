import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HandCoins, Plus } from 'lucide-react';
import { UploadButton } from './upload-button';
import { useState } from 'react';
import { ImportTable } from './import-table';
import { cn, convertAmountToMiliunits } from '@/lib/utils';
import { format, parse } from 'date-fns';

const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

const requiredOptions = [
  'amount', //
  'date',
  'payee',
];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  /**
   * selectedColumns to ignore nulls and then eventually transform this raw upload into new array matching column name to value
   *
   * {
   *  column_1: null
   *  column_2: "date"
   *  column_3: null
   *  column_4: "payee"
   * }
   */
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const headers = data[0]; // ['Type', 'product', 'Started Data', 'etc field names'] []
  const body = data.slice(1); // ['VISA', 'applesx', '2024-03-..02:02', 'blah'] [[],[],[]]

  // Disables item in header dropdown if it's already selected in another column.
  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === 'skip') {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  // Continue 3/3 button or disable button
  const progress = Object.values(selectedColumns).filter(Boolean).length;
  const continueDisabled = progress < requiredOptions.length;

  const handleContinue = () => {
    console.log(headers);
    console.log(body);
    console.log(selectedColumns);

    const mappedData = {
      headers: headers.map((_header, index) => {
        return selectedColumns[`column_${index}`] || null;
      }),
      body: body.map((row, index) => {
        return row.map((cell, index) => {
          return selectedColumns[`column_${index}`] ? cell : null;
        });
      }),
    };

    // remove headers and map header: value for each row in array.
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    console.log(arrayOfData);

    // format for database
    const formattedData = arrayOfData.map((item) => {
      // Handle invalid dates
      let date;
      try {
        date = format(parse(item.date, dateFormat, new Date()), outputFormat);
      } catch (e) {
        console.error(e);
        return {};
      }

      //
      return {
        ...item,
        amount: convertAmountToMiliunits(parseFloat(item.amount)),
        date: date,
      };
    });

    console.log({ formattedData });

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-36 lg:-mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Import Transaction</CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button className="w-full lg:w-auto" onClick={onCancel}>
              Cancel
            </Button>
            {/* <UploadButton onUpload={onUpload} /> */}
            <Button
              disabled={continueDisabled}
              onClick={handleContinue}
              className={cn(!continueDisabled ? 'bg-green-700' : '', 'w-full lg:w-auto')}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
