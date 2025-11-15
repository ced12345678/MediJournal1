
"use client";

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { generateHealthTipsAction } from '@/lib/actions';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Syringe, ShieldAlert, HeartPulse, Loader, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getNamespacedKey } from '@/lib/utils';
import type { GenerateHealthTipsOutput } from '@/ai/flows/generate-health-tips';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Tips"}
        </Button>
    )
}

function ResultsDisplay({ data }: { data: GenerateHealthTipsOutput }) {
    return (
        <div className="mt-6 space-y-4 animate-in fade-in-50 duration-500">
            <Accordion type="multiple" defaultValue={['vaccinations', 'diseases', 'tips']}>
                <AccordionItem value="vaccinations">
                    <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-2">
                           <Syringe className="h-5 w-5 text-primary" />
                           Recommended Vaccinations
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc space-y-2 pl-6">
                            {data.vaccinations.map(item => (
                                <li key={item.name}>
                                    <strong className="text-foreground">{item.name}:</strong>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="diseases">
                    <AccordionTrigger className="text-lg font-semibold">
                       <div className="flex items-center gap-2">
                           <ShieldAlert className="h-5 w-5 text-destructive" />
                           Local Diseases to Know
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                       <ul className="list-disc space-y-2 pl-6">
                            {data.localDiseases.map(item => (
                                <li key={item.name}>
                                    <strong className="text-foreground">{item.name}:</strong>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="tips">
                    <AccordionTrigger className="text-lg font-semibold">
                         <div className="flex items-center gap-2">
                           <HeartPulse className="h-5 w-5 text-accent" />
                           General Health & Safety Tips
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                            {data.healthTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}


export default function HealthTipsGenerator() {
    const { user } = useAuth();
    const [age, setAge] = React.useState('');

     React.useEffect(() => {
        if (!user) return;
        const storedAge = localStorage.getItem(getNamespacedKey('age', user.id));
        if (storedAge) setAge(storedAge);
    }, [user]);

    const initialState = { data: null, error: null };
    const [state, formAction] = useFormState(generateHealthTipsAction, initialState);

    return (
        <Card className="transform transition-all duration-300 hover:shadow-xl">
             <CardHeader>
                <div className="flex items-center gap-3">
                    <Bot className="h-7 w-7 text-primary" />
                    <div>
                        <CardTitle>AI-Powered Travel Health Tips</CardTitle>
                        <CardDescription>Enter a destination to get AI-generated health advice.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="age" value={age} />
                    <div className="space-y-2">
                        <Label htmlFor="location">Travel Destination</Label>
                        <Input name="location" id="location" placeholder="e.g., Costa Rica" required />
                         {state.fieldErrors?.location && (
                             <p className="text-sm font-medium text-destructive">{state.fieldErrors.location[0]}</p>
                         )}
                    </div>
                    <SubmitButton />
                </form>

                {state.error && !state.data && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                {state.data && <ResultsDisplay data={state.data} />}
            </CardContent>
        </Card>
    );
}
