import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from './appwriteClient';
import { Investment, ParsedInvestment, InvestmentItem, Goal } from '../types/models';
import { goalService } from './goalService';

export const investmentService = {
  async getInvestments(userId: string): Promise<Investment> {
    try {
      // 1. Fetch current investments
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.INVESTMENTS,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      let investmentDoc: Investment;
      let parsedInvestment: ParsedInvestment;

      if (response.documents.length > 0) {
        investmentDoc = response.documents[0] as unknown as Investment;
        parsedInvestment = JSON.parse(investmentDoc.data);
      } else {
        // Initialize if not exists
        const initialInvestment: ParsedInvestment = {
          active: [],
          notStarted: [],
          done: []
        };

        const newDoc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.INVESTMENTS,
          ID.unique(),
          {
            data: JSON.stringify(initialInvestment),
            userId
          }
        );

        investmentDoc = newDoc as unknown as Investment;
        parsedInvestment = initialInvestment;
      }

      // 2. Check for migration from Goals
      const goalDoc = await goalService.getGoals(userId);
      const parsedGoals = JSON.parse(goalDoc.data);
      let migratedCount = 0;

      ['active', 'notStarted', 'done'].forEach((section) => {
        const sectionKey = section as keyof typeof parsedGoals;
        const filteredGoals: any[] = [];
        
        (parsedGoals[sectionKey] || []).forEach((item: any) => {
          if (item.isInvestment) {
            // Move to investments
            if (!parsedInvestment[sectionKey]) parsedInvestment[sectionKey] = [];
            parsedInvestment[sectionKey].push({
              ...item,
              risk: item.risk || 'Safe',
              status: typeof item.status === 'number' ? item.status : (item.saved || 0),
              history: item.history || []
            } as InvestmentItem);
            migratedCount++;
          } else {
            filteredGoals.push(item);
          }
        });
        
        parsedGoals[sectionKey] = filteredGoals;
      });

      if (migratedCount > 0) {
        console.log(`Migrating ${migratedCount} investments from goals...`);
        // Save both
        await Promise.all([
          this.updateInvestments(investmentDoc.$id, parsedInvestment),
          goalService.updateGoals(goalDoc.$id, parsedGoals)
        ]);
        
        // Refresh the doc after update
        const updatedResponse = await databases.getDocument(DATABASE_ID, COLLECTIONS.INVESTMENTS, investmentDoc.$id);
        return updatedResponse as unknown as Investment;
      }

      return investmentDoc;
    } catch (error) {
      console.error('Error fetching investments:', error);
      throw new Error('Failed to fetch investments.');
    }
  },

  async updateInvestments(documentId: string, investmentData: ParsedInvestment) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.INVESTMENTS,
        documentId,
        {
          data: JSON.stringify(investmentData)
        }
      );
      return response as unknown as Investment;
    } catch (error) {
      console.error('Error updating investments:', error);
      throw new Error('Failed to update investments.');
    }
  }
};
