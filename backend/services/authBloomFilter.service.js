import BloomFilter from '../utils/BloomFilter.js';
import User from '../models/user.model.js';
import fs from 'fs';
import path from 'path';

/**
 * Auth Bloom Filter Service
 * Manages separate bloom filters for usernames and emails
 */

class AuthBloomFilterService {
  constructor() {
    // Separate filters for username and email
    this.usernameFilter = new BloomFilter(100000, 3);
    this.emailFilter = new BloomFilter(100000, 3);
    
    this.persistencePath = path.join(process.cwd(), 'bloom-filter-auth.json');
    this.initialized = false;
  }

  /**
   * Initialize both bloom filters with existing data from database
   */
  async initialize() {
    try {
      // Try to load from persistence first
      if (await this._loadFromFile()) {
        console.log('✅ Bloom filters loaded from file');
        this.initialized = true;
        return;
      }

      // If no persisted data, load from database
      console.log('📊 Initializing bloom filters from database...');
      const users = await User.find({}, 'username email');
      
      users.forEach(user => {
        this.usernameFilter.add(user.username);
        this.emailFilter.add(user.email);
      });

      console.log(`✅ Bloom filters initialized with ${users.length} users`);
      console.log(`📈 Username filter memory: ${this.usernameFilter.getMemoryUsage()}`);
      console.log(`📈 Email filter memory: ${this.emailFilter.getMemoryUsage()}`);
      console.log(`📉 Username false positive rate: ${(this.usernameFilter.getFalsePositiveProbability(users.length) * 100).toFixed(2)}%`);
      console.log(`📉 Email false positive rate: ${(this.emailFilter.getFalsePositiveProbability(users.length) * 100).toFixed(2)}%`);
      
      // Save to file
      await this._saveToFile();
      this.initialized = true;
    } catch (error) {
      console.error('❌ Error initializing bloom filters:', error);
      this.initialized = false;
    }
  }

  /**
   * Check if username might exist (fast preliminary check)
   */
  async usernameMightExist(username) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    return this.usernameFilter.mightExist(username);
  }

  /**
   * Check if email might exist (fast preliminary check)
   */
  async emailMightExist(email) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    return this.emailFilter.mightExist(email);
  }

  /**
   * Add username and email to bloom filters after successful registration
   */
  addUser(username, email) {
    if (!this.initialized) {
      console.warn('⚠️ Bloom filters not initialized, skipping add');
      return;
    }
    
    this.usernameFilter.add(username);
    this.emailFilter.add(email);
    
    // Periodically save to file (10% chance per addition)
    if (Math.random() < 0.1) {
      this._saveToFile().catch(console.error);
    }
  }

  /**
   * Check if username is available (optimized with bloom filter)
   */
  async isUsernameAvailable(username) {
    // Step 1: Quick bloom filter check
    const mightExist = await this.usernameMightExist(username);
    
    if (!mightExist) {
      // Bloom filter says it definitely doesn't exist
      // No need to check database!
      return true;
    }
    
    // Step 2: Bloom filter says it might exist
    // Do actual database check (could be false positive)
    const existingUser = await User.findOne({ username });
    return !existingUser;
  }

  /**
   * Check if email is available (optimized with bloom filter)
   */
  async isEmailAvailable(email) {
    // Step 1: Quick bloom filter check
    const mightExist = await this.emailMightExist(email);
    
    if (!mightExist) {
      // Bloom filter says it definitely doesn't exist
      return true;
    }
    
    // Step 2: Bloom filter says it might exist
    // Do actual database check
    const existingUser = await User.findOne({ email });
    return !existingUser;
  }

  /**
   * Save bloom filters to file for persistence
   */
  async _saveToFile() {
    try {
      const data = {
        username: this.usernameFilter.export(),
        email: this.emailFilter.export(),
      };
      
      await fs.promises.writeFile(
        this.persistencePath,
        JSON.stringify(data),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving bloom filters:', error);
    }
  }

  /**
   * Load bloom filters from file
   */
  async _loadFromFile() {
    try {
      if (!fs.existsSync(this.persistencePath)) {
        return false;
      }

      const data = await fs.promises.readFile(this.persistencePath, 'utf8');
      const parsed = JSON.parse(data);
      
      this.usernameFilter = BloomFilter.import(parsed.username);
      this.emailFilter = BloomFilter.import(parsed.email);
      
      return true;
    } catch (error) {
      console.error('Error loading bloom filters:', error);
      return false;
    }
  }

  /**
   * Rebuild bloom filters from database (use when needed)
   */
  async rebuild() {
    console.log('🔄 Rebuilding bloom filters...');
    this.usernameFilter.clear();
    this.emailFilter.clear();
    this.initialized = false;
    
    // Delete old persistence file
    if (fs.existsSync(this.persistencePath)) {
      await fs.promises.unlink(this.persistencePath);
    }
    
    await this.initialize();
  }

  /**
   * Get statistics
   */
  async getStats() {
    const userCount = await User.countDocuments();
    
    return {
      initialized: this.initialized,
      userCount,
      username: {
        filterSize: this.usernameFilter.size,
        hashCount: this.usernameFilter.hashCount,
        memoryUsage: this.usernameFilter.getMemoryUsage(),
        falsePositiveRate: `${(this.usernameFilter.getFalsePositiveProbability(userCount) * 100).toFixed(2)}%`,
      },
      email: {
        filterSize: this.emailFilter.size,
        hashCount: this.emailFilter.hashCount,
        memoryUsage: this.emailFilter.getMemoryUsage(),
        falsePositiveRate: `${(this.emailFilter.getFalsePositiveProbability(userCount) * 100).toFixed(2)}%`,
      },
    };
  }
}

// Singleton instance
const authBloomFilter = new AuthBloomFilterService();

export default authBloomFilter;