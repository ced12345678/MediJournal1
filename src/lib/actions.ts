'use server';

import { z } from 'zod';
import { analyzeFamilyHistoryForRiskFactors, familyHistoryChat } from '@/ai/flows/analyze-family-history-for-risk-factors';
import type { AnalyzeFamilyHistoryOutput, FamilyHistoryChatOutput } from '@/ai/flows/analyze-family-history-for-risk-factors';
import { generateHealthTips } from '@/ai/flows/generate-health-tips';
import type { GenerateHealthTipsOutput } from '@/ai/flows/generate-health-tips';

const analysisSchema = z.object({
  familyHistory: z.string().min(50),
});

const chatSchema = z.object({
  history: z.string(),
  question: z.string().min(1),
});

const GenerateHealthTipsInputSchema = z.object({
    location: z.string(),
    age: z.number(),
});

type AnalysisFormState = {
  data: AnalyzeFamilyHistoryOutput | null;
  error: string | null;
};

type ChatFormState = {
    data: FamilyHistoryChatOutput | null;
    error: string | null;
}

type HealthTipsFormState = {
    data: GenerateHealthTipsOutput | null;
    error: string | null;
}

export async function analyzeFamilyHistoryAction(
  values: z.infer<typeof analysisSchema>
): Promise<AnalysisFormState> {
  const validatedFields = analysisSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      data: null,
      error: 'Invalid input. Please provide a more detailed history.',
    };
  }

  try {
    const result = await analyzeFamilyHistoryForRiskFactors({
      familyHistory: validatedFields.data.familyHistory,
    });
    return { data: result, error: null };
  } catch (error) {
    console.error('Error during AI analysis:', error);
    return {
      data: null,
      error: 'An unexpected error occurred while analyzing the history. Please try again later.',
    };
  }
}

export async function familyHistoryChatAction(
    values: z.infer<typeof chatSchema>
): Promise<ChatFormState> {
    const validatedFields = chatSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            data: null,
            error: 'Invalid input. Please type a message.'
        }
    }

    try {
        const result = await familyHistoryChat({
            history: validatedFields.data.history,
            question: validatedFields.data.question
        });
        return { data: result, error: null };
    } catch (error) {
        console.error('Error during AI chat:', error);
        return {
            data: null,
            error: 'An unexpected error occurred in the chat. Please try again.'
        }
    }
}

export async function generateHealthTipsAction(
    values: z.infer<typeof GenerateHealthTipsInputSchema>
): Promise<HealthTipsFormState> {
    const validatedFields = GenerateHealthTipsInputSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            data: null,
            error: 'Invalid input. Please provide a valid location and age.'
        }
    }

    try {
        const result = await generateHealthTips(validatedFields.data);
        return { data: result, error: null };
    } catch (error) {
        console.error('Error generating health tips:', error);
        return {
            data: null,
            error: 'An unexpected error occurred while generating tips. Please try again.'
        }
    }
}
