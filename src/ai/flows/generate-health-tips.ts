
'use server';
/**
 * @fileOverview A flow to generate location-based health tips.
 *
 * - generateHealthTips - A function that calls the Genkit flow.
 * - GenerateHealthTipsInput - The input type for the flow.
 * - GenerateHealthTipsOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthTipsInputSchema = z.object({
  location: z.string().describe('The travel destination.'),
  age: z.number().describe('The age of the traveler.'),
});
export type GenerateHealthTipsInput = z.infer<typeof GenerateHealthTipsInputSchema>;

const TipSchema = z.object({
    name: z.string(),
    description: z.string(),
});

const GenerateHealthTipsOutputSchema = z.object({
  vaccinations: z.array(TipSchema).describe("List of recommended vaccinations for the location."),
  localDiseases: z.array(TipSchema).describe("List of local diseases to be aware of."),
  healthTips: z.array(z.string()).describe("List of general health and safety tips for the location."),
});
export type GenerateHealthTipsOutput = z.infer<typeof GenerateHealthTipsOutputSchema>;

export async function generateHealthTips(input: GenerateHealthTipsInput): Promise<GenerateHealthTipsOutput> {
  return generateHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthTipsPrompt',
  input: {schema: GenerateHealthTipsInputSchema},
  output: {schema: GenerateHealthTipsOutputSchema},
  prompt: `You are a travel health advisor. A user is traveling to the location specified below. 
  
  Based on their age and destination, provide a list of recommended vaccinations, common local diseases to be aware of, and general health and safety tips.

  If the location is generic (e.g., "beach"), provide general advice for that type of environment.

  User Age: {{{age}}}
  Destination: {{{location}}}`,
});

const generateHealthTipsFlow = ai.defineFlow(
  {
    name: 'generateHealthTipsFlow',
    inputSchema: GenerateHealthTipsInputSchema,
    outputSchema: GenerateHealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
