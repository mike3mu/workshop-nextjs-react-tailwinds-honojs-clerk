import { config } from 'dotenv';
import { categories, accounts, transactions } from '@/db/schema';
import { neon } from '@neondatabase/serverless';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import { drizzle } from 'drizzle-orm/neon-http';
import { convertAmountToMiliunits } from '@/lib/utils';

config({ path: '.env.local' });

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = 'user_2m5ol4Cj319JZcZ3iAsgIgsOdKO';
const CATEGORIES = [
  'Food',
  'Rent',
  'Utilities',
  'Clothing',
  'Transportation',
  'Health',
  'Entertainment',
  'Miscellaneous',
];

// Categories
const SEED_CATEGORIES: (typeof categories.$inferInsert)[] = [];
CATEGORIES.forEach((item, index) => {
  //
  SEED_CATEGORIES.push({
    //
    id: `category_${index + 1}`,
    name: item,
    userId: SEED_USER_ID,
    plaidId: null,
  });
});

// Accounts
const ACCOUNTS = ['Checking', 'Savings'];
const SEED_ACCOUNTS: (typeof accounts.$inferInsert)[] = [];
ACCOUNTS.forEach((item, index) => {
  console.log(index);
  SEED_ACCOUNTS.push({
    //
    id: `account_${index + 1}`,
    name: item,
    userId: SEED_USER_ID,
    plaidId: null,
  });
});

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const SEED_TRANSACTIONS: (typeof transactions.$inferSelect)[] = [];

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
  switch (category.name) {
    case 'Rent':
      return Math.random() * 400 + 90;

    case 'Utilities':
      return Math.random() * 200 + 50;
    case 'Food':
      return Math.random() * 30 + 10;
    case 'Transportation':
    case 'Health':
      return Math.random() * 50 + 15;
    case 'Entertainment':
    case 'Clothing':
    case 'Miscellaneous':
      return Math.random() * 100 + 20;
    default:
      return Math.random() * 50 + 10;
  }
};

const generateTransactionsForDay = (day: Date) => {
  const numTransactions = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < numTransactions; i++) {
    const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
    const isExpense = Math.random() < 0.6;

    const amount = generateRandomAmount(category);
    const formattedAmount = convertAmountToMiliunits(isExpense ? -amount : amount);

    SEED_TRANSACTIONS.push({
      id: `transaction_${format(day, 'yyyy-MM-dd')}_${i}`,
      accountId: SEED_ACCOUNTS[0].id,
      categoryId: category.id,
      date: day,
      amount: formattedAmount,
      payee: 'Merchant',
      notes: 'random seeded transaction',
    });
  }
};

const generateTransactions = () => {
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
  days.forEach((day) => generateTransactionsForDay(day));
};

generateTransactions();

const main = async () => {
  try {
    // reset db
    await db.delete(transactions).execute();
    await db.delete(accounts).execute();
    await db.delete(categories).execute();

    // seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute();
    await db.insert(accounts).values(SEED_ACCOUNTS).execute();
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
  } catch (error) {
    console.error('error during seeding', error);
    process.exit();
  }
};

main();
