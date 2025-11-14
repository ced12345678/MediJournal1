'use client';

import React, { useState, useEffect } from 'react';
import { Syringe, Pill, Stethoscope, FilePlus2, HeartPulse, PlusCircle, Activity, Shield, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const eventIcons = {
  Diagnosis: Stethoscope,
  Vaccination: Syringe,
  Procedure: Activity,
  Prescription: Pill,
  Allergy: Shield,
  'Check-up': Stethoscope,
  Birth: Baby,
  Other: HeartPulse
};

const eventTypes = Object.keys(eventIcons);
export type EventType = keyof typeof eventIcons;

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: EventType;
};

const initialEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2005-01-15',
    title: 'First Flu Diagnosis',
    description: 'Diagnosed with Influenza A.',
    type: 'Diagnosis',
  },
  {
    id: '2',
    date: '2010-03-22',
    title: 'Vaccination: MMR',
    description: 'Received Measles, Mumps, and Rubella vaccine.',
    type: 'Vaccination',
  },
  {
    id: '3',
    date: '2018-06-05',
    title: 'Procedure: Tonsillectomy',
    description: 'Surgical removal of tonsils.',
    type: 'Procedure',
  },
  {
    id: '4',
    date: '2021-09-10',
    title: 'Prescription: Amoxicillin',
    description: '10-day course for bacterial infection.',
    type: 'Prescription',
  },
  {
    id: '5',
    date: '2023-02-20',
    title: 'New Allergy: Penicillin',
    description: 'Discovered allergy after a reaction.',
    type: 'Allergy',
  },
  {
    id: '6',
    date: '2023-11-01',
    title: 'Annual Check-up',
    description: 'Routine physical examination. All clear.',
    type: 'Check-up',
  },
];


const TimelineItem = ({ event, isLast }: { event: TimelineEvent; isLast: boolean }) => {
  const Icon = eventIcons[event.type] || HeartPulse;
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="relative pl-10 md:pl-16 py-4">
      {!isLast && <div className="absolute left-4 top-0 h-full w-0.5 bg-border -translate-x-1/2" />}
      
      <div className="absolute left-4 top-6 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{formattedDate}</p>
        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
        <p className="text-sm text-foreground/80">{event.description}</p>
        <Badge variant="outline" className="mt-2 bg-accent/20 text-accent-foreground border-accent/50">{event.type}</Badge>
      </div>
    </div>
  );
};

const AddEventForm = ({ onAddEvent }: { onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<EventType>('Other');
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !type) return;
        onAddEvent({ title, date, description, type });
        setTitle('');
        setDate('');
        setDescription('');
        setType('Other');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add Event
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
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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

export default function TimelineView() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('healthsync-timeline');
      if (storedEvents) {
        setTimelineEvents(JSON.parse(storedEvents));
      } else {
        setTimelineEvents(initialEvents);
        localStorage.setItem('healthsync-timeline', JSON.stringify(initialEvents));
      }
    } catch (error) {
      console.error("Failed to parse timeline events from localStorage", error);
      setTimelineEvents(initialEvents);
    }
  }, []);

  const addEvent = (event: Omit<TimelineEvent, 'id'>) => {
    const newEvent = { ...event, id: self.crypto.randomUUID() };
    const updatedEvents = [...timelineEvents, newEvent].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTimelineEvents(updatedEvents);
    localStorage.setItem('healthsync-timeline', JSON.stringify(updatedEvents));
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-6">
            <AddEventForm onAddEvent={addEvent} />
        </div>
        <div className="relative">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.id} event={event} isLast={index === timelineEvents.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

    