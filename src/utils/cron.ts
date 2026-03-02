import cron from 'node-cron';
import { config } from '../config/config.js';

export const setupCronJobs = () => {
  // Ping health endpoint every 10 minutes to keep service alive
  // Formula: */10 * * * * (At every 10th minute)
  cron.schedule('*/10 * * * *', async () => {
    try {
      const url = process.env.RENDER_EXTERNAL_URL || 'https://three60urban-backend-pg.onrender.com';
      const response = await fetch(`${url}/health`);
      const data = (await response.json()) as { status: string };
      console.log(
        `[Cron Job] Ping status: ${response.status} - ${data.status} at ${new Date().toISOString()}`
      );
    } catch (error) {
      console.error('[Cron Job] Ping failed:', error);
    }
  });

  console.log('✓ Cron jobs initialized (Keep-alive every 10 mins)');
};
