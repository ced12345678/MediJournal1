'use server';

/**
 * @fileOverview Generates personalized health tips based on user's location and age.
 *
 * - generateHealthTips - A function that triggers the health tips generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TipSchema = z.object({
    category: z.string().describe("The category of the health tip (e.g., 'Vaccination', 'Diet', 'Exercise', 'Local Alert')."),
    title: z.string().describe("A short, catchy title for the health tip."),
    description: z.string().describe("A detailed description of the health tip, providing actionable advice."),
    severity: z.enum(['low', 'medium', 'high']).describe("The urgency or importance of the tip."),
});

const GenerateHealthTipsInputSchema = z.object({
    location: z.string().describe("The user's current city and country (e.g., 'New York, USA')."),
    age: z.number().describe("The user's age."),
});
type GenerateHealthTipsInput = z.infer<typeof GenerateHealthTipsInputSchema>;

const GenerateHealthTipsOutputSchema = z.object({
    tips: z.array(TipSchema).describe("An array of personalized health tips."),
});
export type GenerateHealthTipsOutput = z.infer<typeof GenerateHealthTipsOutputSchema>;

export async function generateHealthTips(
    input: GenerateHealthTipsInput
): Promise<GenerateHealthTipsOutput> {
    return generateHealthTipsFlow(input);
}


const healthTipsPrompt = ai.definePrompt({
    name: 'generateHealthTipsPrompt',
    input: { schema: GenerateHealthTipsInputSchema },
    output: { schema: GenerateHealthTipsOutputSchema },
    prompt: `You are a public health expert AI. Your task is to provide relevant, actionable, and location-specific health tips for a user.

    User Information:
    - Age: {{{age}}}
    - Location: {{{location}}}

    Based on this information, please generate a list of 3-5 health tips. The tips should cover:
    1.  **Recommended Vaccinations:** Based on the user's age and common recommendations for their location.
    2.  **Recent Outbreaks/Epidemics:** Mention any notable recent health alerts or seasonal trends for the specified location (use placeholder/simulated data if you don't have real-time access).
    3.  **General Wellness:** Provide lifestyle or dietary tips that are particularly relevant for the user's age group.

    For each tip, determine a severity level (low, medium, high) based on its potential impact on health.
    Format the output as a JSON object containing an array of tips.
    `
});


const generateHealthTipsFlow = ai.defineFlow({
    name: 'generateHealthTipsFlow',
    inputSchema: GenerateHealthTipsInputSchema,
    outputSchema: GenerateHealthTipsOutputSchema,
}, async (input) => {
    const {output} = await healthTipsPrompt(input);
    return output!;
});
