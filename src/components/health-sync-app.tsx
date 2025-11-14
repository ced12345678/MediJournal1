"use client";

import React, { useState } from 'react';
import {
  Users,
  HeartPulse,
  Share2,
  User,
  PanelLeft,
  Stethoscope,
  Clock,
  Pill,
  Map,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';
import TimelineView from './timeline-view';
import FamilyHistoryAnalysis from './family-history-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

const navItems = [
  { id: 'timeline', label: 'Agewise Timeline', icon: Clock },
  { id: 'visits', label: 'Doctor Visits', icon: Stethoscope },
  { id: 'medication', label: 'Medication', icon: Pill },
  { id: 'history', label: 'History', icon: Users },
  { id: 'tips', label: 'Health Tips', icon: HeartPulse },
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

function DoctorVisits() {
    // Dummy data
    const visits = [
        { id: 1, date: '2023-10-26', reason: 'Annual Check-up', doctor: 'Dr. Smith', notes: 'Routine check-up, all vitals normal. Discussed diet and exercise.' },
        { id: 2, date: '2023-05-12', reason: 'Sore Throat', doctor: 'Dr. Jones', notes: 'Diagnosed with strep throat. Prescribed Amoxicillin for 10 days.' },
    ];

    return (
        <div className="p-4 md:p-6 space-y-4">
            {visits.map(visit => (
                <Card key={visit.id}>
                    <CardHeader>
                        <CardTitle>{visit.reason}</CardTitle>
                        <CardDescription>{new Date(visit.date).toLocaleDateString()} - with {visit.doctor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{visit.notes}</p>
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end">
                <Button>Add Visit</Button>
            </div>
        </div>
    );
}

function Medication() {
     const medications = [
        { id: 1, name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day', reason: 'Strep Throat', dates: 'May 2023', status: 'Stopped' },
        { id: 2, name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain', reason: 'General Pain', dates: 'Ongoing', status: 'Active' },
    ];
    return (
        <div className="p-4 md:p-6 space-y-4">
            {medications.map(med => (
                <Card key={med.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{med.name} ({med.dosage})</CardTitle>
                                <CardDescription>{med.frequency} - {med.reason} ({med.dates})</CardDescription>
                            </div>
                             <Badge variant={med.status === 'Active' ? 'default' : 'secondary'} className={med.status === 'Active' ? 'bg-green-600' : ''}>{med.status}</Badge>
                        </div>
                    </CardHeader>
                </Card>
            ))}
            <div className="flex justify-end">
                <Button>Add Medication</Button>
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

    React.useEffect(() => {
      let id = localStorage.getItem('healthsync-userId');
      if (!id) {
        id = `user_${self.crypto.randomUUID()}`;
        localStorage.setItem('healthsync-userId', id);
      }
      setUserId(id);
    }, []);

    const handleDelete = () => {
      localStorage.clear();
      toast({ variant: "destructive", title: "Account Deleted", description: "Your account has been permanently deleted."});
      setTimeout(() => window.location.reload(), 1000);
    }

    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account settings and actions. All your data is stored locally in this browser.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">User ID</p>
                        <p className="font-mono text-sm bg-muted p-2 rounded-md break-all">{userId}</p>
                    </div>
                     <div className="space-y-2">
                        <p className="font-semibold">Name: John Doe</p>
                        <p className="font-semibold">Age: 34</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
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
      <Stethoscope className="h-8 w-8 text-primary" />
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

  const renderContent = () => {
    switch (activeItem.id) {
      case 'timeline':
        return <TimelineView />;
      case 'visits':
        return <DoctorVisits />;
      case 'medication':
        return <Medication />;
      case 'history':
        return <History />;
      case 'account':
        return <AccountSection />;
      case 'tips':
        return <PlaceholderContent title="Health Tips" />;
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

    