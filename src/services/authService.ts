import { account } from './appwriteClient';
import { User } from '../types/models';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return user as unknown as User;
    } catch (error) {
      return null;
    }
  },

  async login(email: string, password: string) {
    try {
      await account.createEmailPasswordSession(email, password);
      return await this.getCurrentUser();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  },

  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async updatePrefs(prefs: Record<string, any>) {
    try {
      return await account.updatePrefs(prefs);
    } catch (error) {
      console.error('Update prefs error:', error);
      throw new Error('Failed to update preferences.');
    }
  }
};
