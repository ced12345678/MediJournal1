"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  HeartPulse,
  Share2,
  User,
  PanelLeft,
  Stethoscope,
  Pill,
  Map,
  Sparkle,
  Biohazard,
  Ruler,
  Weight,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';
import TimelineView, { type TimelineEvent, type EventType, eventTypes, initialEvents } from './timeline-view';
import FamilyHistoryAnalysis from './family-history-analysis';
import SafeTravels from './safe-travels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';


const navItems = [
  { id: 'timeline', label: 'Life', icon: Sparkle },
  { id: 'visits', label: 'Doctor Visits', icon: Stethoscope },
  { id: 'medication', label: 'Medication', icon: Pill },
  { id: 'diseases', label: 'Diseases', icon: Biohazard },
  { id: 'history', label: 'History', icon: Users },
  { id: 'tips', label: 'SafeTravels', icon: Map },
  { id: 'sharing', label: 'Hospital Sharing', icon: Share2 },
  { id: 'account', label: 'Account', icon: User },
];

type NavItem = typeof navItems[number];

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="p-4 md:p-6">
       <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-12">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-2xl font-bold tracking-tight">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">Content for this section is being developed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const AddEventForm = ({
  onAddEvent,
  defaultEventType,
  children,
}: {
  onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void,
  defaultEventType?: EventType,
  children: React.ReactNode
}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<EventType>(defaultEventType || 'Other');
    const [open, setOpen] = useState(false);
    
    // New state for conditional Doctor Visit fields
    const [visitType, setVisitType] = useState<'Casual Visit' | 'Serious Visit' | undefined>();
    const [diseaseName, setDiseaseName] = useState('');
    const [medicationsPrescribed, setMedicationsPrescribed] = useState('');

    useEffect(() => {
        if (defaultEventType) {
            setType(defaultEventType);
        }
    }, [defaultEventType]);
    
    // Reset conditional fields when type changes
    useEffect(() => {
        if (type !== 'Doctor Visit') {
            setVisitType(undefined);
            setDiseaseName('');
            setMedicationsPrescribed('');
        }
    }, [type]);

    const resetForm = () => {
        setTitle('');
        setDate('');
        setAge('');
        setDescription('');
        setType(defaultEventType || 'Other');
        setVisitType(undefined);
        setDiseaseName('');
        setMedicationsPrescribed('');
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !type || !age) return;
        
        let eventDetails: TimelineEvent['details'] = {};
        if (type === 'Doctor Visit') {
            eventDetails = {
                visitType: visitType,
                diseaseName: visitType === 'Serious Visit' ? diseaseName : undefined,
                medicationsPrescribed: visitType === 'Serious Visit' ? medicationsPrescribed : undefined,
            };
        }

        onAddEvent({ title, date, description, type, age: parseInt(age), details: eventDetails });
        resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Add New Timeline Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title / Reason</Label>
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

                    {type === 'Doctor Visit' && (
                        <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label>Visit Type</Label>
                                <RadioGroup value={visitType} onValueChange={(v) => setVisitType(v as 'Casual Visit' | 'Serious Visit')} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Casual Visit" id="casual" />
                                        <Label htmlFor="casual">Casual Visit</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Serious Visit" id="serious" />
                                        <Label htmlFor="serious">Serious Visit</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                             {visitType === 'Serious Visit' && (
                                <div className="space-y-4 pl-2 pt-2 border-l ml-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="diseaseName">Disease Name</Label>
                                        <Input id="diseaseName" value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)} placeholder="e.g., Influenza" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="medicationsPrescribed">Medications Prescribed</Label>
                                        <Input id="medicationsPrescribed" value={medicationsPrescribed} onChange={(e) => setMedicationsPrescribed(e.target.value)} placeholder="e.g., Tamiflu" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description / Notes</Label>
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

function DoctorVisits({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) {
    const visits = events.filter(e => e.type === 'Doctor Visit').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 md:p-6 space-y-4">
            {visits.map(visit => (
                <Card key={visit.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{visit.title}</CardTitle>
                                <CardDescription>{new Date(visit.date).toLocaleDateString()} (Age {visit.age})</CardDescription>
                            </div>
                             {visit.details?.visitType && <Badge variant="outline">{visit.details.visitType}</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{visit.description}</p>
                        {visit.details?.visitType === 'Serious Visit' && (
                            <div className="mt-4 space-y-2 text-sm border-t pt-4">
                                {visit.details.diseaseName && <p><span className="font-semibold">Diagnosis:</span> {visit.details.diseaseName}</p>}
                                {visit.details.medicationsPrescribed && <p><span className="font-semibold">Prescription:</span> {visit.details.medicationsPrescribed}</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end">
                <AddEventForm onAddEvent={onAddEvent} defaultEventType="Doctor Visit">
                    <Button>Add Visit</Button>
                </AddEventForm>
            </div>
        </div>
    );
}

function Medication({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) {
     const medications = events.filter(e => e.type === 'Medication').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 md:p-6 space-y-4">
            {medications.map(med => (
                <Card key={med.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{med.title}</CardTitle>
                                <CardDescription>Started: {new Date(med.date).toLocaleDateString()} (Age {med.age})</CardDescription>
                            </div>
                            <Badge variant={med.details?.status === 'Active' ? 'default' : 'secondary'} className={med.details?.status === 'Active' ? 'bg-green-600' : ''}>
                                {med.details?.status || 'Stopped'}
                            </Badge>
                        </div>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm">{med.description}</p>
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end">
                 <AddEventForm onAddEvent={onAddEvent} defaultEventType="Medication">
                    <Button>Add Medication</Button>
                </AddEventForm>
            </div>
        </div>
    );
}

function Diseases({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void }) {
    const diseases = events.filter(e => e.type === 'Disease').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 md:p-6 space-y-4">
            {diseases.map(disease => (
                <Card key={disease.id}>
                    <CardHeader>
                        <CardTitle>{disease.title}</CardTitle>
                        <CardDescription>Diagnosed: {new Date(disease.date).toLocaleDateString()} (Age {disease.age})</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{disease.description}</p>
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end">
                <AddEventForm onAddEvent={onAddEvent} defaultEventType="Disease">
                    <Button>Add Disease</Button>
                </AddEventForm>
            </div>
        </div>
    );
}

function History() {
    const places = [
        {id: 1, location: 'Mexico', year: 2022, notes: 'Vacation, no health issues.'},
        {id: 2, location: 'India', year: 2019, notes: 'Work trip, received Typhoid vaccine before travel.'}
    ]
    return (
        <div className="p-4 md:p-6">
            <Tabs defaultValue="family">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="family">Family History</TabsTrigger>
                    <TabsTrigger value="travel">Places Travelled</TabsTrigger>
                </TabsList>
                <TabsContent value="family">
                    <FamilyHistoryAnalysis />
                </TabsContent>
                <TabsContent value="travel">
                     <Card>
                        <CardHeader>
                            <CardTitle>Travel History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {places.map(place => (
                                <div key={place.id} className="p-3 rounded-lg border bg-card">
                                    <p className="font-semibold">{place.location} - {place.year}</p>
                                    <p className="text-sm text-muted-foreground">{place.notes}</p>
                                </div>
                            ))}
                            <div className="flex justify-end pt-4">
                                <Button>Add Travel Record</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function AccountSection() {
    const { toast } = useToast();
    const [userId, setUserId] = React.useState('');
    const [name, setName] = React.useState('John Doe');
    const [age, setAge] = React.useState('34');
    const [height, setHeight] = React.useState("6'0\"");
    const [weight, setWeight] = React.useState("175 lbs");

    React.useEffect(() => {
      let id = localStorage.getItem('healthsync-userId');
      if (!id) {
        id = `user_${self.crypto.randomUUID()}`;
        localStorage.setItem('healthsync-userId', id);
      }
      setUserId(id);
      
      const storedName = localStorage.getItem('healthsync-name');
      if (storedName) setName(storedName);
      const storedAge = localStorage.getItem('healthsync-age');
      if (storedAge) setAge(storedAge);
      const storedHeight = localStorage.getItem('healthsync-height');
      if (storedHeight) setHeight(storedHeight);
      const storedWeight = localStorage.getItem('healthsync-weight');
      if (storedWeight) setWeight(storedWeight);

    }, []);

    const handleSave = () => {
        localStorage.setItem('healthsync-name', name);
        localStorage.setItem('healthsync-age', age);
        localStorage.setItem('healthsync-height', height);
        localStorage.setItem('healthsync-weight', weight);
        toast({ title: "Account Updated", description: "Your details have been saved." });
    }

    const handleDelete = () => {
      localStorage.clear();
      toast({ variant: "destructive", title: "All Data Deleted", description: "All your data has been permanently deleted."});
      setTimeout(() => window.location.reload(), 1000);
    }

    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account settings and actions. All your data is stored locally in this browser.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>User ID</Label>
                        <p className="font-mono text-sm bg-muted p-2 rounded-md break-all">{userId}</p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height</Label>
                            <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 6'0&quot;" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight</Label>
                            <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 175 lbs"/>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete All Data & Reset</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all your data from this browser and reset the application.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete Data
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const NavContent = ({
  activeItem,
  setActiveItem,
  closeSheet,
}: {
  activeItem: NavItem;
  setActiveItem: (item: NavItem) => void;
  closeSheet?: () => void;
}) => (
  <>
    <div className="flex items-center gap-2 px-4 py-3 border-b">
      <HeartPulse className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">HealthSync</h1>
    </div>
    <nav className="flex-1 space-y-2 p-4">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeItem.id === item.id ? 'secondary' : 'ghost'}
          className="w-full justify-start gap-3"
          onClick={() => {
            setActiveItem(item);
            closeSheet?.();
          }}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </nav>
  </>
);

export default function HealthSyncApp() {
  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0]);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
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
    const updatedEvents = [...timelineEvents, newEvent]
    setTimelineEvents(updatedEvents);
    localStorage.setItem('healthsync-timeline', JSON.stringify(updatedEvents));
  }
  
  const renderContent = () => {
    switch (activeItem.id) {
      case 'timeline':
        return <TimelineView events={timelineEvents} onAddEvent={addEvent} />;
      case 'visits':
        return <DoctorVisits events={timelineEvents} onAddEvent={addEvent} />;
      case 'medication':
        return <Medication events={timelineEvents} onAddEvent={addEvent} />;
      case 'diseases':
        return <Diseases events={timelineEvents} onAddEvent={addEvent} />;
      case 'history':
        return <History />;
      case 'account':
        return <AccountSection />;
      case 'tips':
        return <SafeTravels />;
      case 'sharing':
        return <PlaceholderContent title="Hospital Sharing" />;
      default:
        return <PlaceholderContent title="Coming Soon" />;
    }
  };

  if (isMobile === undefined) {
    return null; // or a loading spinner
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-2 border-b">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <PanelLeft className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[80%] flex flex-col">
              <NavContent activeItem={activeItem} setActiveItem={setActiveItem} closeSheet={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-lg font-semibold">{activeItem.label}</span>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto bg-secondary/50">{renderContent()}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 flex flex-col border-r bg-card">
        <NavContent activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="p-4 border-t">
            <ThemeToggle />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">{activeItem.label}</h2>
        </header>
        <main className="flex-1 overflow-y-auto bg-secondary/50">
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

    