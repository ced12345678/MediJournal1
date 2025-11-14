'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Syringe, Pill, Stethoscope, HeartPulse, PlusCircle, Biohazard, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

export const eventIcons = {
  Vaccination: Syringe,
  Medication: Pill,
  'Doctor Visit': Stethoscope,
  Disease: Biohazard,
  Other: HeartPulse
};

export const eventTypes = Object.keys(eventIcons);
export type EventType = keyof typeof eventIcons;

export type TimelineEvent = {
  id: string;
  age: number;
  date: string;
  title: string;
  description: string;
  type: EventType;
  details?: {
    status?: 'Active' | 'Stopped';
    visitType?: 'Casual Visit' | 'Serious Visit';
    diseaseName?: string;
    medicationsPrescribed?: string;
  }
};

export const initialEvents: TimelineEvent[] = [];

const TimelineItem = ({ event, isLast }: { event: TimelineEvent; isLast: boolean }) => {
  const Icon = eventIcons[event.type] || HelpCircle;
  return (
    <div className="relative pl-12 py-3 group">
      {!isLast && <div className="absolute left-5 top-0 h-full w-0.5 bg-border -translate-x-1/2" />}
      
      <div className="absolute left-5 top-4 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary/30">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="ml-4">
        <div className="flex items-center gap-2">
            <p className="font-semibold text-md">{event.title}</p>
            {event.details?.visitType && <Badge variant={event.details.visitType === 'Serious Visit' ? 'destructive' : 'secondary'}>{event.details.visitType}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
        <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
        
        {event.type === 'Doctor Visit' && event.details?.visitType === 'Serious Visit' && (
             <div className="mt-2 text-sm space-y-1">
                {event.details.diseaseName && <p><span className="font-semibold">Diagnosis:</span> {event.details.diseaseName}</p>}
                {event.details.medicationsPrescribed && <p><span className="font-semibold">Prescription:</span> {event.details.medicationsPrescribed}</p>}
            </div>
        )}
        
        <div className="flex items-center gap-2 mt-1">
             <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{event.type}</div>
             {event.details?.status && <Badge variant={event.details?.status === 'Active' ? 'default' : 'secondary'} className={event.details?.status === 'Active' ? 'bg-green-600' : ''}>{event.details.status}</Badge>}
        </div>
      </div>
    </div>
  );
};


export default function TimelineView({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
  
  const eventsByAge = useMemo(() => {
    const grouped: { [age: number]: TimelineEvent[] } = {};
    events.forEach(event => {
      if (!grouped[event.age]) {
        grouped[event.age] = [];
      }
      grouped[event.age].push(event);
    });
    // Sort events within each age group chronologically
    for (const age in grouped) {
      grouped[age].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return grouped;
  }, [events]);

  const sortedAges = useMemo(() => {
      return Object.keys(eventsByAge).map(Number).sort((a, b) => b - a);
  }, [eventsByAge]);


  return (
    <div className="p-4 md:p-6 lg:p-8 relative">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Your Life Story</CardTitle>
                    <CardDescription>A chronological record of your health journey, organized by age.</CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedAges.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full" defaultValue={`age-${sortedAges[0]}`}>
                            {sortedAges.map(age => {
                                const ageEvents = eventsByAge[age];
                                if (!ageEvents || ageEvents.length === 0) {
                                    return null;
                                }
                                const eventSummary = ageEvents.map(e => e.type).slice(0, 3).join(', ') + (ageEvents.length > 3 ? '...' : '');
                                return (
                                    <AccordionItem value={`age-${age}`} key={age}>
                                        <AccordionTrigger className="text-xl font-bold">
                                            <div className="flex justify-between w-full items-center pr-4">
                                                <span>Age {age}</span>
                                                <span className="text-sm font-normal text-muted-foreground">{eventSummary}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="relative pt-2">
                                                {ageEvents.map((event, index) => (
                                                    <TimelineItem key={event.id} event={event} isLast={index === ageEvents.length - 1} />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                     ) : (
                        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-12">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">No Events Yet</h3>
                                <p className="text-sm text-muted-foreground">Click the plus button to add your first health event.</p>
                            </div>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
