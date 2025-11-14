'use server';

/**
 * @fileOverview Analyzes family medical history to identify potential health risk factors.
 *
 * - analyzeFamilyHistoryForRiskFactors - A function that triggers the analysis flow.
 * - AnalyzeFamilyHistoryInput - The input type for the analysis function.
 * - AnalyzeFamilyHistoryOutput - The return type for the analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFamilyHistoryInputSchema = z.object({
  familyHistory: z
    .string()
    .describe('A detailed narrative of the user and their family members medical history.'),
});
export type AnalyzeFamilyHistoryInput = z.infer<typeof AnalyzeFamilyHistoryInputSchema>;

const AnalyzeFamilyHistoryOutputSchema = z.object({
  riskFactors: z
    .string()
    .describe(
      'A summary of potential health risk factors identified based on the provided family history.'
    ),
});
export type AnalyzeFamilyHistoryOutput = z.infer<typeof AnalyzeFamilyHistoryOutputSchema>;

export async function analyzeFamilyHistoryForRiskFactors(
  input: AnalyzeFamilyHistoryInput
): Promise<AnalyzeFamilyHistoryOutput> {
  return analyzeFamilyHistoryFlow(input);
}

const analyzeFamilyHistoryPrompt = ai.definePrompt({
  name: 'analyzeFamilyHistoryPrompt',
  input: {schema: AnalyzeFamilyHistoryInputSchema},
  output: {schema: AnalyzeFamilyHistoryOutputSchema},
  prompt: `You are a medical expert tasked with analyzing family medical history to identify potential health risk factors for the user.

  Based on the following family history, identify and summarize the most significant potential health risks for the user:

  Family History: {{{familyHistory}}}

  Focus on identifying genetic predispositions, shared environmental factors, and lifestyle patterns that could increase the user's risk for certain diseases or conditions.
  Provide a concise summary of these risk factors.
  `,
});

const analyzeFamilyHistoryFlow = ai.defineFlow(
  {
    name: 'analyzeFamilyHistoryFlow',
    inputSchema: AnalyzeFamilyHistoryInputSchema,
    outputSchema: AnalyzeFamilyHistoryOutputSchema,
  },
  async input => {
    const {output} = await analyzeFamilyHistoryPrompt(input);
    return output!;
  }
);
