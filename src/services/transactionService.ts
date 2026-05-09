import { databases, DATABASE_ID, COLLECTIONS, Query } from './appwriteClient';
import { Transaction } from '../types/models';

const PAGE_SIZE = 20;

export const transactionService = {
  /**
   * Fetches transactions with cursor-based pagination.
   * @param userId The ID of the user whose transactions to fetch.
   * @param lastId The ID of the last document from the previous page (optional).
   * @returns A promise that resolves to an object containing the transactions and the ID of the last document.
   */
  async getTransactions(userId: string, lastId?: string) {
    try {
      const queries = [
        Query.equal('userId', userId),
        Query.orderDesc('date'),
        Query.limit(PAGE_SIZE),
      ];

      if (lastId) {
        queries.push(Query.cursorAfter(lastId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        queries
      );

      // Map Appwrite documents to our Transaction model
      const transactions = response.documents.map((doc) => {
        // Assuming 'data' field is used for custom fields in the old system,
        // but let's assume flat structure for modern Appwrite usage if possible.
        // The old code did: JSON.parse(doc.data)
        // If the new system uses the same structure, we handle it here.
        
        let data = {};
        try {
          // Check if 'data' field exists and is a string (legacy support)
          if (typeof (doc as any).data === 'string') {
            data = JSON.parse((doc as any).data);
          } else {
            // New system might use flat attributes
            data = doc;
          }
        } catch (e) {
          data = doc;
        }

        return {
          ...data,
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
          $permissions: doc.$permissions,
          $databaseId: doc.$databaseId,
          $collectionId: doc.$collectionId,
        } as Transaction;
      });

      return {
        transactions,
        total: response.total,
        nextCursor: transactions.length === PAGE_SIZE ? transactions[transactions.length - 1].$id : null,
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions. Please try again later.');
    }
  },

  async addTransaction(transaction: Omit<Transaction, keyof import('./appwriteClient').ID | '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        'unique()',
        transaction
      );

      return response as unknown as Transaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw new Error('Failed to add transaction. Please check your input.');
    }
  },

  async updateTransaction(documentId: string, transaction: Partial<Transaction>) {
    try {
      const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, ...pureData } = transaction as any;
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TRANSACTIONS,
        documentId,
        pureData
      );
      return response as unknown as Transaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Failed to update transaction.');
    }
  },
  
  async deleteTransaction(documentId: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TRANSACTIONS, documentId);
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction.');
    }
  }
};
