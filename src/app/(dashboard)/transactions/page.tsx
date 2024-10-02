'use client';
import { Loader2, Plus } from 'lucide-react';

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transactions';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';

import { transactions as transactionSchema } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { columns } from './columns';
import { useState } from 'react';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
import { toast } from 'sonner';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
  data: JSON.parse(
    '[["Type","product","Started Date","Completed Date","Description","Amount","Fee","Currency","State","Balance"],["CARD_PAYMENT","Current","2024-09-01 06:49:02","2024-09-02 11:03:43","Shop","-13.27","0.00","EUR","COMPLETED","11.82"],["CARD_PAYMENT","Current","2024-09-09 21:01:17","2024-09-10 03:44:40","Texts","-4.59","0.00","EUR","COMPLETED","7.18"],["TOPUP","Current","2024-09-23 23:36:34","2024-09-23 23:36:36","Shop Pay Top-Up","20.00","0.00","EUR","COMPLETED","27.18"],["TOPUP","Current","2024-09-30 15:52:13","2024-09-30 15:52:14","Shop Pay Top-Up","20.00","0.00","EUR","COMPLETED","27.18"],["CARD_PAYMENT","Current","2024-09-30 17:22:55","2024-09-11 12:07:20","Shop","-13.27","0.00","EUR","COMPLETED","13.91"],["CARD_PAYMENT","Current","2024-09-30 15:54:15","2024-09-11 15:34:28","Online","-13.18","0.13","EUR","COMPLETED","0.60"],["TOPUP","Current","2024-09-10 17:20:08","2024-09-10 17:20:09","Shop Pay Top-Up","20.00","0.00","EUR","COMPLETED","20.60"],["CARD_PAYMENT","Current","2024-09-10 17:20:25","2024-09-12 10:56:22","Groceries","-14.53","0.00","EUR","COMPLETED","6.07"],["CARD_PAYMENT","Current","2024-09-12 23:55:47","2024-09-13 15:57:40","Texts","-4.72","0.05","EUR","COMPLETED","1.30"]]'
  ),
  errors: [],
  meta: {},
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results);
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled = transactionsQuery.isLoading || transactionsQuery.isPending;

  const onSubmitImport = async (values: (typeof transactionSchema.$inferInsert)[]) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error('please select an account to continue.');
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-36 lg:-mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
          //
        />
      </>
    );
  }

  return (
    <>
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-36 lg:-mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">Transactions History</CardTitle>
            <div className="flex items-center gap-x-2">
              <Button onClick={newTransaction.onOpen}>
                <Plus className="size-4 mr-2" />
                Add New
              </Button>
              <UploadButton onUpload={onUpload} />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              filterKey="name"
              columns={columns}
              data={transactions}
              onDelete={(row) => {
                const ids = row.map((r) => r.original.id);
                deleteTransactions.mutate({ ids });
              }}
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransactionsPage;
