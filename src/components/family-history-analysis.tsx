"use client";

import React, { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familyHistoryAnalysisAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Loader2 } from "lucide-react";
import type { AnalyzeFamilyHistoryOutput } from "@/ai/flows/analyze-family-history-for-risk-factors";

const formSchema = z.object({
  familyHistory: z.string().min(50, {
    message: "Please provide a detailed family history of at least 50 characters.",
  }),
});

type FormState = {
  data: AnalyzeFamilyHistoryOutput | null;
  error: string | null;
};

export default function FamilyHistoryAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>({ data: null, error: null });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyHistory: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormState({ data: null, error: null });
    startTransition(async () => {
      const result = await familyHistoryAnalysisAction(values);
      setFormState(result);
    });
  }

  return (
    <div className="p-4 md:p-6 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Family History Analysis</CardTitle>
          <CardDescription>
            Describe your family's medical history to receive an AI-powered analysis of potential health risk factors. Include details about parents, grandparents, and siblings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="familyHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'My father had high blood pressure starting in his 40s. My paternal grandmother had Type 2 diabetes...'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze History
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {formState.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}

      {formState.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI-Generated Risk Factor Summary
            </CardTitle>
            <CardDescription>
              Based on the history you provided, here are some potential health risk factors to be aware of. This is not medical advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{formState.data.riskFactors}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
