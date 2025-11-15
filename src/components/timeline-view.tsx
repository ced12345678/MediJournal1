
'use client';

import React, { useMemo, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { AddEventForm } from './add-event-form';
import { type TimelineEvent, eventIcons } from './health-sync-app';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const TimelineItem = ({ event }: { event: TimelineEvent; }) => {
  const Icon = eventIcons[event.type] || HelpCircle;
  return (
    <div className="relative pl-8 py-3 group animate-in fade-in-50 duration-500">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
      
      <div className="absolute left-0 top-4 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary/30 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="ml-4">
        <div className="flex items-center gap-2">
            <p className="font-semibold text-md text-foreground">{event.title}</p>
            {event.details?.visitType && <Badge variant={event.details.visitType === 'Serious Visit' ? 'destructive' : 'secondary'}>{event.details.visitType}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
        <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
        
        {event.type === 'Doctor Visit' && event.details?.visitType === 'Serious Visit' && (
             <div className="mt-2 text-sm space-y-1">
                {event.details.diseaseName && <p><span className="font-semibold text-foreground">Diagnosis:</span> {event.details.diseaseName}</p>}
                {event.details.medicationsPrescribed && <p><span className="font-semibold text-foreground">Prescription:</span> {event.details.medicationsPrescribed}</p>}
            </div>
        )}
        
        <div className="flex items-center gap-2 mt-1">
             <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{event.type}</div>
             {event.details?.status && <Badge variant={event.details?.status === 'Active' ? 'default' : 'secondary'} className={event.details?.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>{event.details.status}</Badge>}
        </div>
      </div>
    </div>
  );
};


export default function TimelineView({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
  
  const [openAge, setOpenAge] = useState<number | null>(null);

  const eventsByAge = useMemo(() => {
    const grouped: { [age: number]: TimelineEvent[] } = {};
    events.forEach(event => {
      const age = event.age;
      if (!grouped[age]) {
        grouped[age] = [];
      }
      grouped[age].push(event);
    });
    for (const age in grouped) {
      grouped[age].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return grouped;
  }, [events]);

  const sortedAges = useMemo(() => {
      return Object.keys(eventsByAge).map(Number).sort((a, b) => b - a);
  }, [eventsByAge]);

  const colors = [
    { bg: 'bg-chart-1/80', border: 'border-chart-1' },
    { bg: 'bg-chart-2/80', border: 'border-chart-2' },
    { bg: 'bg-chart-3/80', border: 'border-chart-3' },
    { bg: 'bg-chart-4/80', border: 'border-chart-4' },
    { bg: 'bg-chart-5/80', border: 'border-chart-5' },
  ];

  return (
    <div className="relative">
        <div className="max-w-4xl mx-auto">
             <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tighter text-foreground">Your Life Story</h2>
                    <AddEventForm onAddEvent={onAddEvent}>
                        <Button>Add Event</Button>
                    </AddEventForm>
                </div>
            </header>
            
            {sortedAges.length > 0 ? (
                <div className="relative">
                    <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
                    {sortedAges.map((age, index) => {
                        const ageEvents = eventsByAge[age];
                        if (!ageEvents || ageEvents.length === 0) return null;
                        
                        const isOpen = openAge === age;
                        
                        const positionIndex = index % 4;
                        let position: 'left' | 'center' | 'right';

                        if (positionIndex === 0) position = 'left';
                        else if (positionIndex === 1) position = 'center';
                        else if (positionIndex === 2) position = 'right';
                        else position = 'center';

                        const color = colors[index % colors.length];

                        return (
                           <div key={age} className="relative w-full py-4 flex flex-col items-center">
                                <Collapsible 
                                    open={isOpen}
                                    onOpenChange={() => setOpenAge(isOpen ? null : age)}
                                    className="w-full"
                                >
                                    <div className="relative h-20 w-full flex items-center">
                                        <CollapsibleTrigger asChild className="group w-full">
                                            <div className="flex items-center">
                                                {position === 'left' && (
                                                    <div className="flex items-center justify-end w-1/2 pr-4">
                                                         <div className={cn("flex items-center justify-center font-bold text-2xl h-20 w-48 transition-all duration-300 hover:scale-105 border-4", color.bg, color.border)}>
                                                            {age}
                                                        </div>
                                                        <div className="w-20 h-0.5 bg-border" />
                                                    </div>
                                                )}
                                                {position === 'center' && (
                                                    <div className="w-full flex justify-center">
                                                        <div className={cn("flex items-center justify-center font-bold text-2xl h-20 w-48 transition-all duration-300 hover:scale-105 border-4", color.bg, color.border)}>
                                                            {age}
                                                        </div>
                                                    </div>
                                                )}
                                                {position === 'right' && (
                                                    <>
                                                        <div className="w-1/2" />
                                                        <div className="flex items-center justify-start w-1/2 pl-4">
                                                            <div className="w-20 h-0.5 bg-border" />
                                                            <div className={cn("flex items-center justify-center font-bold text-2xl h-20 w-48 transition-all duration-300 hover:scale-105 border-4", color.bg, color.border)}>
                                                                {age}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </CollapsibleTrigger>
                                    </div>
                                    
                                    <CollapsibleContent
                                        className={cn(
                                            'relative w-full flex pt-4'
                                        )}
                                    >
                                        <div className="w-full flex items-start">
                                            {position === 'left' && (
                                                <div className="w-1/2 flex justify-end pr-4">
                                                    <div className={cn('relative p-6 bg-card rounded-lg border w-[320px] max-h-96 overflow-y-auto')}>
                                                        <h3 className="text-lg font-semibold mb-4">Events at Age {age}</h3>
                                                        {ageEvents.map((event) => (
                                                            <TimelineItem key={event.id} event={event} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {position === 'center' && (
                                                 <div className="w-full flex justify-center">
                                                    <div className={cn('relative p-6 bg-card rounded-lg border w-[320px] max-h-96 overflow-y-auto')}>
                                                        <h3 className="text-lg font-semibold mb-4">Events at Age {age}</h3>
                                                        {ageEvents.map((event) => (
                                                            <TimelineItem key={event.id} event={event} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                             {position === 'right' && (
                                                 <>
                                                    <div className="w-1/2" />
                                                    <div className="w-1/2 flex justify-start pl-4">
                                                        <div className={cn('relative p-6 bg-card rounded-lg border w-[320px] max-h-96 overflow-y-auto')}>
                                                            <h3 className="text-lg font-semibold mb-4">Events at Age {age}</h3>
                                                            {ageEvents.map((event) => (
                                                                <TimelineItem key={event.id} event={event} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                 </>
                                            )}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                           </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-24 bg-card">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">No Events Yet</h3>
                        <p className="text-sm text-muted-foreground">Click the "Add Event" button to add your first health event.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}



