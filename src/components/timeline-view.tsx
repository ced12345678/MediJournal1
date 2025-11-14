'use client';

import React, { useMemo } from 'react';
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

export const initialEvents: TimelineEvent[] = [
    {
        id: '1', age: 0, date: '1999-05-20', title: 'Born',
        description: 'Born at City General Hospital.',
        type: 'Other',
    },
    {
        id: '2', age: 1, date: '2000-07-15', title: 'DTaP & Polio Vaccine',
        description: 'Received first doses of DTaP and Polio vaccines.',
        type: 'Vaccination',
    },
    {
        id: '3', age: 4, date: '2003-06-01', title: 'MMR & Varicella Vaccine',
        description: 'Received Measles, Mumps, Rubella, and Chickenpox vaccines.',
        type: 'Vaccination',
    },
    {
        id: '4', age: 6, date: '2005-09-10', title: 'Broken Arm',
        description: 'Fell from monkey bars, resulting in a fractured left radius. Cast for 6 weeks.',
        type: 'Doctor Visit',
        details: { visitType: 'Serious Visit', diseaseName: 'Fractured Radius' }
    },
     {
        id: '12', age: 7, date: '2006-11-01', title: 'Chickenpox',
        description: 'Contracted chickenpox. Recovered after two weeks of rest.',
        type: 'Disease',
    },
    {
        id: '5', age: 11, date: '2010-08-20', title: 'Tdap & HPV Vaccine',
        description: 'Received Tdap booster and first dose of HPV vaccine.',
        type: 'Vaccination',
    },
    {
        id: '6', age: 16, date: '2015-05-30', title: 'Annual Physical',
        description: 'Sports physical for high school soccer. All clear.',
        type: 'Doctor Visit',
        details: { visitType: 'Casual Visit' }
    },
    {
        id: '7', age: 18, date: '2017-12-22', title: 'Wisdom Teeth Extraction',
        description: 'All four wisdom teeth removed. Prescribed Vicodin for pain.',
        type: 'Medication',
        details: { status: 'Stopped' }
    },
    {
        id: '8', age: 22, date: '2021-04-15', title: 'COVID-19 Vaccine',
        description: 'Received first dose of Pfizer-BioNTech COVID-19 vaccine.',
        type: 'Vaccination',
    },
    {
        id: '9', age: 22, date: '2021-05-06', title: 'COVID-19 Vaccine',
        description: 'Received second dose of Pfizer-BioNTech COVID-19 vaccine.',
        type: 'Vaccination',
    },
    {
        id: '10', age: 24, date: '2023-11-02', title: 'Sprained Ankle',
        description: 'Sprained right ankle playing basketball. Advised RICE protocol.',
        type: 'Doctor Visit',
        details: { visitType: 'Serious Visit', diseaseName: 'Ankle Sprain' }
    },
    {
        id: '11', age: 25, date: '2024-06-10', title: 'Annual Check-up',
        description: 'Routine physical. All vitals normal. Blood work looks good.',
        type: 'Doctor Visit',
        details: { visitType: 'Casual Visit' }
    },
];

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
            {event.details?.visitType && <Badge variant="outline">{event.details.visitType}</Badge>}
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

const AddEventForm = ({ onAddEvent }: { onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) => {
    const [title, setTitle] = React.useState('');
    const [date, setDate] = React.useState('');
    const [age, setAge] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [type, setType] = React.useState<EventType>('Other');
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !type || !age) return;
        onAddEvent({ title, date, description, type, age: parseInt(age) });
        setTitle('');
        setDate('');
        setAge('');
        setDescription('');
        setType('Other');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-10">
                    <PlusCircle className="h-8 w-8" />
                    <span className="sr-only">Add Event</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Timeline Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Event Type</Label>
                        <Select onValueChange={(value) => setType(value as EventType)} value={type}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an event type" />
                            </SelectTrigger>
                            <SelectContent>
                                {eventTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Event</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function TimelineView({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) {
  
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
        <AddEventForm onAddEvent={onAddEvent} />
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
