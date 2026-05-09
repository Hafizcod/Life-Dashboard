import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error('Appwrite configuration missing. Please check your .env file.');
}

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

export const COLLECTIONS = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  GOALS: 'goals',
  BUDGETS: 'budgets',
  INVESTMENTS: 'investment',
} as const;

export default client;
