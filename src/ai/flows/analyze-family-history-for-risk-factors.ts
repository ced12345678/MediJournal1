'use server';

/**
 * @fileOverview Analyzes family medical history to identify potential health risk factors.
 *
 * - analyzeFamilyHistoryForRiskFactors - A function that triggers the analysis flow.
 * - familyHistoryChat - A function that handles the conversational part of gathering history.
 * - AnalyzeFamilyHistoryInput - The input type for the analysis function.
 * - AnalyzeFamilyHistoryOutput - The return type for the analysis function.
 * - FamilyHistoryChatInput - The input type for the chat function.
 * - FamilyHistoryChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for final analysis
const AnalyzeFamilyHistoryInputSchema = z.object({
  familyHistory: z
    .string()
    .describe('A detailed narrative of the user and their family members medical history, gathered from a conversation.'),
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


// Schema for conversational chat
const FamilyHistoryChatInputSchema = z.object({
    history: z.string().describe("The entire conversation history so far."),
    question: z.string().describe("The user's latest message or question."),
});
export type FamilyHistoryChatInput = z.infer<typeof FamilyHistoryChatInputSchema>;

const FamilyHistoryChatOutputSchema = z.object({
    response: z.string().describe("The AI's next question or response in the conversation.")
});
export type FamilyHistoryChatOutput = z.infer<typeof FamilyHistoryChatOutputSchema>;


export async function analyzeFamilyHistoryForRiskFactors(
  input: AnalyzeFamilyHistoryInput
): Promise<AnalyzeFamilyHistoryOutput> {
  return analyzeFamilyHistoryFlow(input);
}

export async function familyHistoryChat(
    input: FamilyHistoryChatInput
): Promise<FamilyHistoryChatOutput> {
    return familyHistoryChatFlow(input);
}

const analysisPrompt = ai.definePrompt({
  name: 'analyzeFamilyHistoryPrompt',
  input: {schema: AnalyzeFamilyHistoryInputSchema},
  output: {schema: AnalyzeFamilyHistoryOutputSchema},
  prompt: `You are a medical expert tasked with analyzing family medical history to identify potential health risk factors for the user.

  Based on the following family history conversation, identify and summarize the most significant potential health risks for the user:

  Family History: {{{familyHistory}}}

  Focus on identifying genetic predispositions, shared environmental factors, and lifestyle patterns that could increase the user's risk for certain diseases or conditions.
  Provide a concise summary of these risk factors. This is the FINAL analysis. Do not ask more questions.
  `,
});

const chatPrompt = ai.definePrompt({
    name: 'familyHistoryChatPrompt',
    input: {schema: FamilyHistoryChatInputSchema },
    output: {schema: FamilyHistoryChatOutputSchema },
    prompt: `You are a friendly and empathetic AI medical historian. Your goal is to have a conversation with a user to build a comprehensive family medical history. 
    
    Ask clarifying questions to gather details. Be conversational. Ask one question at a time.
    If the user seems to be done, you can ask "Is there anything else you'd like to add?".
    If the user says "no" or "that's it", you can respond with "Great! Whenever you're ready, you can click the 'Finalize & Analyze History' button to get your risk summary."

    Conversation History:
    {{{history}}}

    Based on the history, continue the conversation.
    `
})

const analyzeFamilyHistoryFlow = ai.defineFlow(
  {
    name: 'analyzeFamilyHistoryFlow',
    inputSchema: AnalyzeFamilyHistoryInputSchema,
    outputSchema: AnalyzeFamilyHistoryOutputSchema,
  },
  async input => {
    const {output} = await analysisPrompt(input);
    return output!;
  }
);


const familyHistoryChatFlow = ai.defineFlow({
    name: 'familyHistoryChatFlow',
    inputSchema: FamilyHistoryChatInputSchema,
    outputSchema: FamilyHistoryChatOutputSchema,
}, async (input) => {
    const {output} = await chatPrompt(input);
    return output!;
});

    