import { databases, DATABASE_ID, COLLECTIONS, Query, ID } from './appwriteClient';
import { Category } from '../types/models';

export const categoryService = {
  async getCategories(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [Query.equal('userId', userId), Query.limit(100)]
      );
      return response.documents as unknown as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories.');
    }
  },

  async addCategory(userId: string, category: Omit<Category, keyof import('appwrite').Models.Document>) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        ID.unique(),
        { ...category, userId }
      );
      return response as unknown as Category;
    } catch (error) {
      console.error('Error adding category:', error);
      throw new Error('Failed to add category.');
    }
  },

  async updateCategory(documentId: string, category: Partial<Category>) {
    try {
      const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, userId, ...pureData } = category as any;
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        documentId,
        pureData
      );
      return response as unknown as Category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category.');
    }
  },

  async deleteCategory(documentId: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, documentId);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category.');
    }
  }
};
