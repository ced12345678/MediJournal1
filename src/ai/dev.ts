import { config } from 'dotenv';
config();

// Flows are commented out to prevent them from being registered.
// import '@/ai/flows/analyze-family-history-for-risk-factors.ts';
import '@/ai/flows/generate-health-tips.ts';
