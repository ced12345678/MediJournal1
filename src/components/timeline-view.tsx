'use client';

import React from 'react';
import { Syringe, Pill, Stethoscope, FilePlus2, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const timelineEvents = [
  {
    id: 1,
    date: 'Jan 15, 2005',
    title: 'First Flu Diagnosis',
    description: 'Diagnosed with Influenza A.',
    icon: HeartPulse,
    type: 'Diagnosis',
  },
  {
    id: 2,
    date: 'Mar 22, 2010',
    title: 'Vaccination: MMR',
    description: 'Received Measles, Mumps, and Rubella vaccine.',
    icon: Syringe,
    type: 'Vaccination',
  },
  {
    id: 3,
    date: 'Jun 05, 2018',
    title: 'Procedure: Tonsillectomy',
    description: 'Surgical removal of tonsils.',
    icon: Stethoscope,
    type: 'Procedure',
  },
  {
    id: 4,
    date: 'Sep 10, 2021',
    title: 'Prescription: Amoxicillin',
    description: '10-day course for bacterial infection.',
    icon: Pill,
    type: 'Prescription',
  },
  {
    id: 5,
    date: 'Feb 20, 2023',
    title: 'New Allergy: Penicillin',
    description: 'Discovered allergy after a reaction.',
    icon: FilePlus2,
    type: 'Allergy',
  },
  {
    id: 6,
    date: 'Nov 01, 2023',
    title: 'Annual Check-up',
    description: 'Routine physical examination. All clear.',
    icon: Stethoscope,
    type: 'Check-up',
  },
];

type TimelineEvent = typeof timelineEvents[number];

const TimelineItem = ({ event, isLast }: { event: TimelineEvent; isLast: boolean }) => {
  const Icon = event.icon;
  return (
    <div className="relative pl-10 md:pl-16 py-4">
      {/* Vertical line */}
      {!isLast && <div className="absolute left-4 top-0 h-full w-0.5 bg-border -translate-x-1/2" />}
      
      {/* Icon and Circle */}
      <div className="absolute left-4 top-6 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{event.date}</p>
        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
        <p className="text-sm text-foreground/80">{event.description}</p>
        <Badge variant="outline" className="mt-2 bg-accent/20 text-accent-foreground border-accent/50">{event.type}</Badge>
      </div>
    </div>
  );
};


export default function TimelineView() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.id} event={event} isLast={index === timelineEvents.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
