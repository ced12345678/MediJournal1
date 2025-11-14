'use client';

import React, { useState, useEffect } from 'react';
import { Syringe, Pill, Stethoscope, HeartPulse, PlusCircle, Weight, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const eventIcons = {
  Vaccination: Syringe,
  Medication: Pill,
  'Doctor Visit': Stethoscope,
  Measurement: Ruler,
  Other: HeartPulse
};

const eventTypes = Object.keys(eventIcons);
export type EventType = keyof typeof eventIcons;

export type TimelineEvent = {
  id: string;
  age: number;
  date: string;
  title: string;
  description: string;
  type: EventType;
  details?: {
    height?: string;
    weight?: string;
  }
};

const initialEvents: TimelineEvent[] = [
    {
        id: '1', age: 5, date: '2005-01-15', title: 'MMR Vaccine',
        description: 'Received the Measles, Mumps, and Rubella vaccine.',
        type: 'Vaccination',
    },
    {
        id: '2', age: 10, date: '2010-08-20', title: 'Annual Physical',
        description: 'Height and weight measured.',
        type: 'Measurement',
        details: { height: "4'5\"", weight: "70 lbs" }
    },
    {
        id: '3', age: 15, date: '2015-06-01', title: 'Wisdom Tooth Extraction',
        description: 'Prescribed Ibuprofen for pain management.',
        type: 'Medication',
    },
    {
        id: '4', age: 20, date: '2020-03-10', title: 'Flu Shot',
        description: 'Annual influenza vaccination.',
        type: 'Vaccination',
    },
    {
        id: '5', age: 25, date: '2025-02-05', title: 'Annual Check-up',
        description: 'Routine physical. All vitals normal.',
        type: 'Doctor Visit',
    },
];

const TimelineItem = ({ event, isLast }: { event: TimelineEvent; isLast: boolean }) => {
  const Icon = eventIcons[event.type] || HeartPulse;
  return (
    <div className="relative pl-12 py-4 group">
      {!isLast && <div className="absolute left-5 top-0 h-full w-0.5 bg-border -translate-x-1/2" />}
      
      <div className="absolute left-5 top-5 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">Age {event.age} &bull; {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{event.type}</div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-foreground/80 mb-2">{event.description}</p>
            {event.details && (
                 <div className="flex gap-4 pt-2 border-t mt-2">
                    {event.details.height && <div className="flex items-center gap-2 text-sm"><Ruler className="w-4 h-4 text-muted-foreground" /> <span>{event.details.height}</span></div>}
                    {event.details.weight && <div className="flex items-center gap-2 text-sm"><Weight className="w-4 h-4 text-muted-foreground" /> <span>{event.details.weight}</span></div>}
                 </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

const AddEventForm = ({ onAddEvent }: { onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<EventType>('Other');
    const [open, setOpen] = useState(false);

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

export default function TimelineView() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('healthsync-timeline');
      if (storedEvents) {
        setTimelineEvents(JSON.parse(storedEvents));
      } else {
        const sortedInitial = initialEvents.sort((a,b) => b.age - a.age);
        setTimelineEvents(sortedInitial);
        localStorage.setItem('healthsync-timeline', JSON.stringify(sortedInitial));
      }
    } catch (error) {
      console.error("Failed to parse timeline events from localStorage", error);
      const sortedInitial = initialEvents.sort((a,b) => b.age - a.age);
      setTimelineEvents(sortedInitial);
    }
  }, []);

  const addEvent = (event: Omit<TimelineEvent, 'id'>) => {
    const newEvent = { ...event, id: self.crypto.randomUUID() };
    const updatedEvents = [...timelineEvents, newEvent].sort((a,b) => b.age - a.age);
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
