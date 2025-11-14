'use server';

import { z } from 'zod';
import { analyzeFamilyHistoryForRiskFactors } from '@/ai/flows/analyze-family-history-for-risk-factors';
import type { AnalyzeFamilyHistoryOutput } from '@/ai/flows/analyze-family-history-for-risk-factors';

const formSchema = z.object({
  familyHistory: z.string().min(50),
});

type FormState = {
  data: AnalyzeFamilyHistoryOutput | null;
  error: string | null;
};

export async function familyHistoryAnalysisAction(
  values: z.infer<typeof formSchema>
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(values);

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
