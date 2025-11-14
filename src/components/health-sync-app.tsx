"use client";

import React, { useState } from 'react';
import {
  FileText,
  Users,
  HeartPulse,
  Repeat,
  GitCommitHorizontal,
  Share2,
  User,
  PanelLeft,
  Stethoscope,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';
import TimelineView from './timeline-view';
import FamilyHistoryAnalysis from './family-history-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { id: 'timeline', label: 'Timeline View', icon: GitCommitHorizontal },
  { id: 'family-history', label: 'Family History', icon: Users },
  { id: 'records', label: 'Private Records', icon: FileText },
  { id: 'prescriptions', label: 'Prescriptions', icon: Repeat },
  { id: 'tips', label: 'Health Tips', icon: HeartPulse },
  { id: 'sharing', label: 'Data Sharing', icon: Share2 },
  { id: 'account', label: 'Account', icon: User },
];

type NavItem = typeof navItems[number];

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg bg-card border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">Content for this section is coming soon.</p>
      </div>
    </div>
  );
}

function AccountSection() {
    const { toast } = useToast();
    const userId = "user_21c1fdef-3456-7890-abcd-ef1234567890";

    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account settings and actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">User ID</p>
                        <p className="font-mono text-sm bg-muted p-2 rounded-md break-all">{userId}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Sign Out</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will be returned to the login page.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => toast({ title: "Signed Out", description: "You have been successfully signed out."})}>
                                        Sign Out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => toast({ variant: "destructive", title: "Account Deleted", description: "Your account has been permanently deleted."})}>
                                        Delete Account
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
      case 'family-history':
        return <FamilyHistoryAnalysis />;
      case 'account':
        return <AccountSection />;
      case 'records':
        return <PlaceholderContent title="Private Records" />;
      case 'prescriptions':
        return <PlaceholderContent title="Recurrence & Prescriptions" />;
      case 'tips':
        return <PlaceholderContent title="Health Tips" />;
      case 'sharing':
        return <PlaceholderContent title="Data Sharing" />;
      default:
        return <PlaceholderContent title="Coming Soon" />;
    }
  };

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
