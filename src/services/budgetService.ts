import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from './appwriteClient';
import { Budget, ParsedBudget } from '../types/models';

export const budgetService = {
  async getBudget(userId: string): Promise<Budget> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Budget;
      }

      // Initialize if not exists
      const initialBudget: ParsedBudget = {
        items: [],
        goals: [],
        income: { monthly: 0, daily: 0 }
      };

      const newDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        ID.unique(),
        {
          data: JSON.stringify(initialBudget),
          userId
        }
      );

      return newDoc as unknown as Budget;
    } catch (error) {
      console.error('Error fetching budget:', error);
      throw new Error('Failed to fetch budget.');
    }
  },

  async updateBudget(documentId: string, budgetData: ParsedBudget) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BUDGETS,
        documentId,
        {
          data: JSON.stringify(budgetData)
        }
      );
      return response as unknown as Budget;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw new Error('Failed to update budget.');
    }
  }
};
