import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from './appwriteClient';
import { Goal, ParsedGoal } from '../types/models';

export const goalService = {
  async getGoals(userId: string): Promise<Goal> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.GOALS,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Goal;
      }

      // Initialize if not exists
      const initialGoals: ParsedGoal = {
        active: [],
        notStarted: [],
        done: []
      };

      const newDoc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.GOALS,
        ID.unique(),
        {
          data: JSON.stringify(initialGoals),
          userId
        }
      );

      return newDoc as unknown as Goal;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw new Error('Failed to fetch goals.');
    }
  },

  async updateGoals(documentId: string, goalsData: ParsedGoal) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.GOALS,
        documentId,
        {
          data: JSON.stringify(goalsData)
        }
      );
      return response as unknown as Goal;
    } catch (error) {
      console.error('Error updating goals:', error);
      throw new Error('Failed to update goals.');
    }
  }
};
