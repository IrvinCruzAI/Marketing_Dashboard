import Dexie, { Table } from 'dexie';
import { Asset, BusinessSettings } from '../types';

class MarketingDatabase extends Dexie {
  settings!: Table<BusinessSettings, number>;
  assets!: Table<Asset, string>;

  constructor() {
    super('MarketingDashboard');
    
    this.version(21).stores({
      settings: '++id',
      assets: 'id, type, status, createdAt, updatedAt'
    });
  }

  async getSettings(): Promise<BusinessSettings | undefined> {
    return await this.settings.toCollection().first();
  }

  async saveSettings(settings: BusinessSettings): Promise<number> {
    // Check if settings already exist
    const existing = await this.getSettings();
    if (existing) {
      // Update existing settings
      await this.settings.update(1, settings);
      return 1;
    } else {
      // Create new settings
      return await this.settings.add(settings);
    }
  }

  async getAssets(
    type?: Asset['type'], 
    status?: Asset['status']
  ): Promise<Asset[]> {
    let collection = this.assets.orderBy('createdAt').reverse();
    
    if (type) {
      collection = collection.filter(asset => asset.type === type);
    }
    
    if (status) {
      collection = collection.filter(asset => asset.status === status);
    }
    
    return await collection.toArray();
  }

  async getAssetById(id: string): Promise<Asset | undefined> {
    return await this.assets.get(id);
  }

  async saveAsset(asset: Asset): Promise<string> {
    return await this.assets.put(asset);
  }

  async deleteAsset(id: string): Promise<void> {
    await this.assets.delete(id);
  }

  async updateAssetStatus(id: string, status: Asset['status']): Promise<void> {
    await this.assets.update(id, { 
      status, 
      updatedAt: new Date().toISOString() 
    });
  }

  async searchAssets(query: string): Promise<Asset[]> {
    return await this.assets
      .filter(asset => {
        const searchString = JSON.stringify(asset).toLowerCase();
        return searchString.includes(query.toLowerCase());
      })
      .orderBy('createdAt')
      .reverse()
      .toArray();
  }
}

export const db = new MarketingDatabase();