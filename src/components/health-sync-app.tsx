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
  LogOut,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';
import TimelineView, { type TimelineEvent, type EventType, eventTypes, initialEvents } from './timeline-view';
import HospitalSharing from './hospital-sharing';
import History from './history';
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
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { getNamespacedKey } from '@/lib/utils';


const navItems = [
  { id: 'timeline', label: 'Life', icon: Sparkle },
  { id: 'visits', label: 'Doctor Visits', icon: Stethoscope },
  { id: 'medication', label: 'Medication', icon: Pill },
  { id: 'diseases', label: 'Diseases', icon: Biohazard },
  { id: 'history', label: 'History', icon: Users },
  { id: 'sharing', label: 'Hospital Sharing', icon: Share2 },
  { id: 'account', label: 'Account', icon: User },
];

type NavItem = typeof navItems[number];


const AddEventForm = ({
  onAddEvent,
  defaultEventType,
  hideAgeInput = false,
  children,
}: {
  onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void,
  defaultEventType?: EventType,
  hideAgeInput?: boolean,
  children: React.ReactNode
}) => {
    const { user } = useAuth();
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
    
    // New state for Disease medication
    const [medicationForDisease, setMedicationForDisease] = useState('');

     useEffect(() => {
        if (open) {
            if (defaultEventType) {
                setType(defaultEventType);
            }
            if (user) {
                const storedAge = localStorage.getItem(getNamespacedKey('age', user.id)) || '';
                setAge(storedAge);
            }
        }
    }, [open, defaultEventType, user]);
    
    // Reset conditional fields when type changes
    useEffect(() => {
        if (type !== 'Doctor Visit') {
            setVisitType(undefined);
            setDiseaseName('');
            setMedicationsPrescribed('');
        }
        if (type !== 'Disease') {
            setMedicationForDisease('');
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
        setMedicationForDisease('');
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !type || !age) return;
        
        let eventDetails: TimelineEvent['details'] = {};
        if (type === 'Doctor Visit') {
            const newEvents: Omit<TimelineEvent, 'id'>[] = [];
            let visitDescription = description;
            
            const visitEvent: Omit<TimelineEvent, 'id'> = {
                title,
                date,
                description: visitDescription,
                type: 'Doctor Visit',
                age: parseInt(age),
                details: {
                    visitType: visitType,
                    diseaseName: visitType === 'Serious Visit' ? diseaseName : undefined,
                    medicationsPrescribed: visitType === 'Serious Visit' ? medicationsPrescribed : undefined,
                }
            };
            newEvents.push(visitEvent);

            if (visitType === 'Serious Visit' && diseaseName) {
                newEvents.push({
                    title: diseaseName,
                    date: date,
                    description: `Diagnosed during a visit for: ${title}.`,
                    type: 'Disease',
                    age: parseInt(age),
                });
            }
             if (visitType === 'Serious Visit' && medicationsPrescribed) {
                newEvents.push({
                    title: medicationsPrescribed,
                    date: date,
                    description: `Prescribed for ${diseaseName || title}`,
                    type: 'Medication',
                    age: parseInt(age),
                    details: { status: 'Stopped' }
                });
            }

            onAddEvent(newEvents);
        } else if (type === 'Disease' && medicationForDisease) {
            const diseaseEvent: Omit<TimelineEvent, 'id'> = {
                title,
                date,
                description: `${description}`,
                type: 'Disease',
                age: parseInt(age),
            };
            const medicationEvent: Omit<TimelineEvent, 'id'> = {
                title: medicationForDisease,
                date,
                description: `Prescribed for ${title}`,
                type: 'Medication',
                age: parseInt(age),
                details: { status: 'Stopped' }
            };
             onAddEvent([diseaseEvent, medicationEvent]);
        }
        else {
            onAddEvent({ title, date, description, type, age: parseInt(age), details: eventDetails });
        }

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
                <ScrollArea className="max-h-[80vh] pr-6">
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title / Reason</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            {!hideAgeInput && (
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                                </div>
                            )}
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
                                    <div className="space-y-4 pl-2 pt-4 border-l ml-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="diseaseName">Diagnosis / Disease Name (optional)</Label>
                                            <Input id="diseaseName" value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)} placeholder="e.g., Influenza" />
                                             <p className="text-xs text-muted-foreground">This will also create a new entry in the "Diseases" section.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="medicationsPrescribed">Medications Prescribed (optional)</Label>
                                            <Input id="medicationsPrescribed" value={medicationsPrescribed} onChange={(e) => setMedicationsPrescribed(e.target.value)} placeholder="e.g., Tamiflu" />
                                            <p className="text-xs text-muted-foreground">This will also create a new entry in the "Medication" section.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                         {type === 'Disease' && (
                            <div className="space-y-4 pt-4 border-t">
                                 <div className="space-y-2">
                                    <Label htmlFor="medicationForDisease">Medication Prescribed (optional)</Label>
                                    <Input id="medicationForDisease" value={medicationForDisease} onChange={(e) => setMedicationForDisease(e.target.value)} placeholder="e.g., Amoxicillin" />
                                    <p className="text-xs text-muted-foreground">If entered, this will also create an entry in the "Medication" section.</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Description / Notes</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                               <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add Event</Button>
                        </DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

function DoctorVisits({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
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
                             {visit.details?.visitType && <Badge variant={visit.details.visitType === 'Serious Visit' ? 'destructive' : 'secondary'}>{visit.details.visitType}</Badge>}
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
                <AddEventForm onAddEvent={onAddEvent} defaultEventType="Doctor Visit" hideAgeInput={true}>
                    <Button>Add Visit</Button>
                </AddEventForm>
            </div>
        </div>
    );
}

function Medication({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
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
                 <AddEventForm onAddEvent={onAddEvent} defaultEventType="Medication" hideAgeInput={true}>
                    <Button>Add Medication</Button>
                </AddEventForm>
            </div>
        </div>
    );
}

function Diseases({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
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
                <AddEventForm onAddEvent={onAddEvent} defaultEventType="Disease" hideAgeInput={true}>
                    <Button>Add Disease</Button>
                </AddEventForm>
            </div>
        </div>
    );
}

function AccountSection() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    
    const [name, setName] = React.useState('');
    const [age, setAge] = React.useState('');
    const [height, setHeight] = React.useState("");
    const [weight, setWeight] = React.useState("");

    React.useEffect(() => {
        if (!user) return;

        setName(user.name);

        const storedAge = localStorage.getItem(getNamespacedKey('age', user.id));
        if (storedAge) setAge(storedAge);
        const storedHeight = localStorage.getItem(getNamespacedKey('height', user.id));
        if (storedHeight) setHeight(storedHeight);
        const storedWeight = localStorage.getItem(getNamespacedKey('weight', user.id));
        if (storedWeight) setWeight(storedWeight);

    }, [user]);

    const handleSave = () => {
        if (!user) return;
        localStorage.setItem(getNamespacedKey('age', user.id), age);
        localStorage.setItem(getNamespacedKey('height', user.id), height);
        localStorage.setItem(getNamespacedKey('weight', user.id), weight);
        toast({ title: "Account Updated", description: "Your details have been saved." });
    }

    const handleDelete = () => {
      if (!user) return;
      // This is a simplified example. In a real app, you'd want a more robust way to delete user data.
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`healthsync-${user.id}-`)) {
          localStorage.removeItem(key);
        }
      });
      // Also remove family history which has a different key structure
      localStorage.removeItem(getNamespacedKey('familyHistory', user.id));
      localStorage.removeItem(getNamespacedKey('travelHistory', user.id));
      
      toast({ variant: "destructive", title: "All Data Deleted", description: "All your health data has been permanently deleted."});
      // We don't reload, logout will redirect
    }

    if (!user) return null;

    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account settings and actions. All your data is stored locally in this browser.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Username</Label>
                        <p className="font-mono text-sm bg-muted p-2 rounded-md break-all">{user.username}</p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Current Age</Label>
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
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete All Data</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all your health data from this browser. Your account will not be deleted.
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
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0]);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!user) return;
    try {
      const key = getNamespacedKey('timeline', user.id);
      const storedEvents = localStorage.getItem(key);
      if (storedEvents) {
        setTimelineEvents(JSON.parse(storedEvents));
      } else {
        setTimelineEvents(initialEvents);
        localStorage.setItem(key, JSON.stringify(initialEvents));
      }
    } catch (error) {
      console.error("Failed to parse timeline events from localStorage", error);
      setTimelineEvents(initialEvents);
    }
  }, [user]);

  const addEvent = (eventOrEvents: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => {
    if (!user) return;
    const eventsToAdd = Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents];
    
    const newEvents = eventsToAdd.map(event => ({ ...event, id: self.crypto.randomUUID() }));

    const updatedEvents = [...timelineEvents, ...newEvents]
    setTimelineEvents(updatedEvents);
    localStorage.setItem(getNamespacedKey('timeline', user.id), JSON.stringify(updatedEvents));
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
      case 'sharing':
        return <HospitalSharing />;
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
             {activeItem.id === 'timeline' && (
              <div className="p-4 md:p-6 flex justify-end">
                <AddEventForm onAddEvent={addEvent}><Button>Add Event</Button></AddEventForm>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

    