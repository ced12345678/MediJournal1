
"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  HeartPulse,
  Share2,
  User,
  Stethoscope,
  Pill,
  Sparkle,
  Biohazard,
  LogOut,
  Moon,
  Sun,
  Settings,
  Menu,
  Syringe,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimelineView from './timeline-view';
import HospitalSharing from './hospital-sharing';
import History from './history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/hooks/use-auth';
import { getNamespacedKey } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from './ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Badge } from './ui/badge';
import { AddEventForm } from './add-event-form';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'timeline', label: 'Life', icon: Sparkle },
  { id: 'visits', label: 'Doctor Visits', icon: Stethoscope },
  { id: 'medication', label: 'Medication', icon: Pill },
  { id: 'diseases', label: 'Diseases', icon: Biohazard },
  { id: 'history', label: 'History', icon: Users },
  { id: 'sharing', label: 'Hospital Sharing', icon: Share2 },
];

export type NavItem = typeof navItems[number] | {id: 'account', label: 'Account', icon: typeof User };


function DoctorVisits({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
    const visits = events.filter(e => e.type === 'Doctor Visit').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Doctor Visits</h2>
                <AddEventForm onAddEvent={onAddEvent} defaultEventType="Doctor Visit" hideAgeInput={true}>
                    <Button>Add Visit</Button>
                </AddEventForm>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {visits.map(visit => (
                    <Card key={visit.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{visit.title}</CardTitle>
                                    <CardDescription>{new Date(visit.date).toLocaleDateString()} (Age {visit.age})</CardDescription>
                                </div>
                                {visit.details?.visitType && <Badge variant={visit.details.visitType === 'Serious Visit' ? 'destructive' : 'secondary'}>{visit.details.visitType}</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{visit.description}</p>
                            {visit.details?.visitType === 'Serious Visit' && (
                                <div className="mt-4 space-y-2 text-sm border-t pt-4">
                                    {visit.details.diseaseName && <p><span className="font-semibold text-foreground">Diagnosis:</span> {visit.details.diseaseName}</p>}
                                    {visit.details.medicationsPrescribed && <p><span className="font-semibold text-foreground">Prescription:</span> {visit.details.medicationsPrescribed}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function Medication({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
     const medications = events.filter(e => e.type === 'Medication').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Medication</h2>
                <AddEventForm onAddEvent={onAddEvent} defaultEventType="Medication" hideAgeInput={true}>
                    <Button>Add Medication</Button>
                </AddEventForm>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medications.map(med => (
                <Card key={med.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{med.title}</CardTitle>
                                <CardDescription>Started: {new Date(med.date).toLocaleDateString()} (Age {med.age})</CardDescription>
                            </div>
                            <Badge variant={med.details?.status === 'Active' ? 'default' : 'secondary'} className={cn(med.details?.status === 'Active' ? 'bg-accent text-accent-foreground' : '')}>
                                {med.details?.status || 'Stopped'}
                            </Badge>
                        </div>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">{med.description}</p>
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>
    );
}

function Diseases({ events, onAddEvent }: { events: TimelineEvent[], onAddEvent: (event: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => void }) {
    const diseases = events.filter(e => e.type === 'Disease').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Diseases</h2>
                 <AddEventForm onAddEvent={onAddEvent} defaultEventType="Disease" hideAgeInput={true}>
                    <Button>Add Disease</Button>
                </AddEventForm>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diseases.map(disease => (
                <Card key={disease.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">{disease.title}</CardTitle>
                        <CardDescription>Diagnosed: {new Date(disease.date).toLocaleDateString()} (Age {disease.age})</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{disease.description}</p>
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>
    );
}

function AccountSection({ onNavigate }: { onNavigate: (item: NavItem) => void }) {
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
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`healthsync-${user.id}-`)) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem(getNamespacedKey('familyHistory', user.id));
      localStorage.removeItem(getNamespacedKey('travelHistory', user.id));
      
      toast({ variant: "destructive", title: "All Data Deleted", description: "All your health data has been permanently deleted."});
    }

    if (!user) return null;

    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold text-foreground mb-6">Account Information</h2>
            <Card className="transform transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your account settings. All your data is stored locally in this browser.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Username</Label>
                        <p className="font-mono text-sm bg-muted p-3 rounded-lg break-all">{user.username}</p>
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
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                        <Button onClick={handleSave}>Save Changes</Button>
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

const AppHeader = ({ onNavigate, activeItem }: { onNavigate: (item: NavItem) => void; activeItem: NavItem; }) => {
    const { user, logout } = useAuth();
    const { setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-20 bg-background/95 backdrop-blur-sm border-b">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <HeartPulse className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">HealthSync</h1>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="hidden md:flex items-center gap-2 text-muted-foreground">
                            <Menu className="h-5 w-5" />
                            <span>Sections</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                         {navItems.map(item => (
                            <DropdownMenuItem key={item.id} onClick={() => onNavigate(item)} className={cn(activeItem.id === item.id && "bg-primary/10")}>
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div className="flex items-center gap-3">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild className="md:hidden">
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {navItems.map(item => (
                            <DropdownMenuItem key={item.id} onClick={() => onNavigate(item)}>
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            {user?.name || 'My Account'}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onNavigate({id: 'account', label: 'Account', icon: User})}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span>Toggle Theme</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};


export default function HealthSyncApp() {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<NavItem>(navItems[0]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!user) return;
    try {
      const key = getNamespacedKey('timeline', user.id);
      const storedEvents = localStorage.getItem(key);
      if (storedEvents) {
        setTimelineEvents(JSON.parse(storedEvents));
      } else {
        setTimelineEvents([]);
      }
    } catch (error) {
      console.error("Failed to parse timeline events from localStorage", error);
      setTimelineEvents([]);
    }
  }, [user]);

  useEffect(() => {
    if (timelineEvents.length > 0 && user) {
        localStorage.setItem(getNamespacedKey('timeline', user.id), JSON.stringify(timelineEvents));
    }
  }, [timelineEvents, user]);

  const addEvent = (eventOrEvents: Omit<TimelineEvent, 'id'> | Omit<TimelineEvent, 'id'>[]) => {
    if (!user) return;
    const eventsToAdd = Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents];
    
    const newEvents = eventsToAdd.map(event => ({ ...event, id: self.crypto.randomUUID() }));

    const updatedEvents = [...timelineEvents, ...newEvents]
    setTimelineEvents(updatedEvents);
    localStorage.setItem(getNamespacedKey('timeline', user.id), JSON.stringify(updatedEvents));
  }
  
  const renderContent = () => {
    let content;
    switch (activeItem.id) {
      case 'timeline':
        content = <TimelineView events={timelineEvents} onAddEvent={addEvent} />;
        break;
      case 'visits':
        content = <DoctorVisits events={timelineEvents} onAddEvent={addEvent} />;
        break;
      case 'medication':
        content = <Medication events={timelineEvents} onAddEvent={addEvent} />;
        break;
      case 'diseases':
        content = <Diseases events={timelineEvents} onAddEvent={addEvent} />;
        break;
      case 'history':
        content = <History />;
        break;
      case 'account':
        content = <AccountSection onNavigate={setActiveItem} />;
        break;
      case 'sharing':
        content = <HospitalSharing />;
        break;
      default:
        content = <TimelineView events={timelineEvents} onAddEvent={addEvent} />;
        break;
    }
    return <div key={activeItem.id} className="animate-in fade-in-50 duration-500">{content}</div>;
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader onNavigate={setActiveItem} activeItem={activeItem} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
             {renderContent()}
            </div>
        </main>
    </div>
  );
}

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

export const eventIcons = {
  Vaccination: Syringe,
  Medication: Pill,
  'Doctor Visit': Stethoscope,
  Disease: Biohazard,
  Other: HeartPulse
};

export const eventTypes = Object.keys(eventIcons) as EventType[];
export type EventType = keyof typeof eventIcons;

    