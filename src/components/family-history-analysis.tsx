"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { familyHistoryChatAction, analyzeFamilyHistoryAction } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Loader2, Send, User, Bot } from "lucide-react";
import type { AnalyzeFamilyHistoryOutput } from "@/ai/flows/analyze-family-history-for-risk-factors";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AnalysisState = {
  data: AnalyzeFamilyHistoryOutput | null;
  error: string | null;
  isAnalyzing: boolean;
};

export default function FamilyHistoryAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ data: null, error: null, isAnalyzing: false });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('healthsync-familyHistory');
      if (storedHistory) {
        const { messages: storedMessages, analysis } = JSON.parse(storedHistory);
        setMessages(storedMessages || []);
        if (analysis) {
          setAnalysisState({ data: analysis, error: null, isAnalyzing: false });
        } else if (storedMessages.length === 0) {
            fetchInitialMessage();
        }
      } else {
        fetchInitialMessage();
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      fetchInitialMessage();
    }
  }, []);

  const fetchInitialMessage = () => {
    startTransition(async () => {
      const initialMessage = "Can you give me a brief overview of your family's medical history to start? Mention any known conditions for your parents, grandparents, and siblings.";
      const updatedMessages = [{ role: 'assistant', content: initialMessage }] as ChatMessage[];
      setMessages(updatedMessages);
      updateLocalStorage(updatedMessages, null);
    });
  };

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isPending]);

  const updateLocalStorage = (msgs: ChatMessage[], analysis: AnalyzeFamilyHistoryOutput | null) => {
    localStorage.setItem('healthsync-familyHistory', JSON.stringify({ messages: msgs, analysis }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      const result = await familyHistoryChatAction({
        history: newMessages.map(m => `${m.role}: ${m.content}`).join('\n'),
        question: input,
      });

      if (result.error) {
        setAnalysisState({ ...analysisState, error: result.error });
        return;
      }
      
      const assistantMessage: ChatMessage = { role: 'assistant', content: result.data!.response };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      updateLocalStorage(updatedMessages, analysisState.data);
    });
  };
  
  const handleFinalizeAnalysis = () => {
    setAnalysisState({ data: null, error: null, isAnalyzing: true });
    startTransition(async () => {
        const fullHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        const result = await analyzeFamilyHistoryAction({ familyHistory: fullHistory });
        setAnalysisState({ data: result.data, error: result.error, isAnalyzing: false });
        if(result.data) {
            updateLocalStorage(messages, result.data);
        }
    })
  }

  const handleReset = () => {
    setMessages([]);
    setAnalysisState({ data: null, error: null, isAnalyzing: false });
    localStorage.removeItem('healthsync-familyHistory');
    fetchInitialMessage();
  }

  if (analysisState.data) {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        AI-Generated Risk Factor Summary
                    </CardTitle>
                    <CardDescription>
                        This summary is based on the conversation below. This is not medical advice.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>{analysisState.data.riskFactors}</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Conversation History</CardTitle>
                        <Button variant="outline" onClick={handleReset}>Start New Analysis</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "")}>
                                {message.role === 'assistant' && <Avatar className="w-8 h-8 border"><AvatarFallback><Bot size={18} /></AvatarFallback></Avatar>}
                                <div className={cn("rounded-lg p-3 text-sm max-w-[80%]", message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                    <p>{message.content}</p>
                                </div>
                                {message.role === 'user' && <Avatar className="w-8 h-8 border"><AvatarFallback><User size={18} /></AvatarFallback></Avatar>}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Family History AI Assistant</CardTitle>
          <CardDescription>
            Chat with our AI to build your family's medical history. When you're done, finalize the analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? "justify-end" : "")}>
                    {message.role === 'assistant' && <Avatar className="w-8 h-8 border"><AvatarFallback><Bot size={18} /></AvatarFallback></Avatar>}
                    <div className={cn("rounded-lg p-3 text-sm max-w-[80%]", message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <p>{message.content}</p>
                    </div>
                    {message.role === 'user' && <Avatar className="w-8 h-8 border"><AvatarFallback><User size={18} /></AvatarFallback></Avatar>}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border"><AvatarFallback><Bot size={18} /></AvatarFallback></Avatar>
                    <div className="rounded-lg p-3 text-sm bg-muted flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isPending}
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
              <Send />
            </Button>
          </form>
        </CardContent>
        <div className="p-6 pt-0 border-t">
            <Button onClick={handleFinalizeAnalysis} disabled={analysisState.isAnalyzing || messages.length < 2}>
                {analysisState.isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizing Analysis...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Finalize & Analyze History
                  </>
                )}
              </Button>
        </div>
      </Card>

      {analysisState.error && (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{analysisState.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
