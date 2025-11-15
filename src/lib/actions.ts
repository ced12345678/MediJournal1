'use server';

import { z } from 'zod';
import { generateHealthTips } from '@/ai/flows/generate-health-tips';
import type { GenerateHealthTipsOutput } from '@/ai/flows/generate-health-tips';


// AI-related imports are commented out or removed
// import { analyzeFamilyHistoryForRiskFactors, familyHistoryChat } from '@/ai/flows/analyze-family-history-for-risk-factors';
// import type { AnalyzeFamilyHistoryOutput, FamilyHistoryChatOutput } from '@/ai/flows/analyze-family-history-for-risk-factors';


const analysisSchema = z.object({
  familyHistory: z.string().min(50),
});

const chatSchema = z.object({
  history: z.string(),
  question: z.string().min(1),
});

const GenerateHealthTipsInputSchema = z.object({
    location: z.string().min(2, "Location must be at least 2 characters."),
    age: z.number(),
});

// Type definitions remain for structure, but functions are removed
type AnalyzeFamilyHistoryOutput = any;
type FamilyHistoryChatOutput = any;


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
    fieldErrors?: Record<string, string[]>;
}

export async function analyzeFamilyHistoryAction(
  values: z.infer<typeof analysisSchema>
): Promise<AnalysisFormState> {
    return {
        data: null,
        error: "This feature has been disabled to prevent costs."
    }
}

export async function familyHistoryChatAction(
    values: z.infer<typeof chatSchema>
): Promise<ChatFormState> {
    return {
        data: null,
        error: "This feature has been disabled to prevent costs."
    }
}

export async function generateHealthTipsAction(
   prevState: HealthTipsFormState,
   formData: FormData,
): Promise<HealthTipsFormState> {
    const rawData = {
        location: formData.get('location'),
        age: formData.get('age')
    };

    const parsedAge = rawData.age ? parseInt(rawData.age as string, 10) : 0;
    
    const validatedFields = GenerateHealthTipsInputSchema.safeParse({
        location: rawData.location,
        age: parsedAge,
    });

    if (!validatedFields.success) {
        return {
            data: null,
            error: "Please check your inputs.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const result = await generateHealthTips(validatedFields.data);
        return {
            data: result,
            error: null
        }
    } catch(e: any) {
        console.error(e);
        return {
            data: null,
            error: "The AI model could not be reached. Please try again later."
        }
    }
}
