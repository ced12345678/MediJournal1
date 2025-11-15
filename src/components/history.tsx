"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getNamespacedKey } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import HealthTipsGenerator from './health-tips-generator';


type TravelRecord = {
    id: string;
    location: string;
    year: string;
    duration: string;
    notes: string;
}

const AddTravelRecordForm = ({ onAdd }: { onAdd: (record: Omit<TravelRecord, 'id'>) => void }) => {
    const [location, setLocation] = useState('');
    const [year, setYear] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location || !year) return;
        onAdd({ location, year, duration, notes });
        setLocation('');
        setYear('');
        setDuration('');
        setNotes('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Travel Record</Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Add New Travel Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g., Mexico" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} required placeholder="e.g., 2023"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (optional)</Label>
                            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 2 weeks" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Visited for a conference"/>
                    </div>
                     <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Record</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function TravelHistory() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [travelHistory, setTravelHistory] = useState<TravelRecord[]>([]);

    useEffect(() => {
        if (!user) return;
        const key = getNamespacedKey('travelHistory', user.id);
        const storedHistory = localStorage.getItem(key);
        if (storedHistory) {
            setTravelHistory(JSON.parse(storedHistory));
        }
    }, [user]);

    const saveHistory = (history: TravelRecord[]) => {
        if (!user) return;
        const key = getNamespacedKey('travelHistory', user.id);
        localStorage.setItem(key, JSON.stringify(history));
        setTravelHistory(history);
    }

    const handleAddRecord = (record: Omit<TravelRecord, 'id'>) => {
        const newRecord = { ...record, id: self.crypto.randomUUID() };
        const updatedHistory = [...travelHistory, newRecord];
        saveHistory(updatedHistory);
        toast({ title: "Travel Record Added" });
    }

    const handleDeleteRecord = (id: string) => {
        const updatedHistory = travelHistory.filter(record => record.id !== id);
        saveHistory(updatedHistory);
        toast({ title: "Travel Record Deleted" });
    }

    return (
        <Card className="transform transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Travel History</CardTitle>
                    <CardDescription>A log of places you have traveled to.</CardDescription>
                </div>
                 <AddTravelRecordForm onAdd={handleAddRecord} />
            </CardHeader>
            <CardContent className="space-y-4">
                 {travelHistory.length > 0 ? travelHistory.sort((a,b) => parseInt(b.year) - parseInt(a.year)).map(place => (
                    <div key={place.id} className="relative p-4 rounded-lg border bg-background group">
                        <div className="pr-10">
                            <p className="font-semibold">{place.location} - {place.year}</p>
                            {place.duration && <p className="text-sm text-muted-foreground">Duration: {place.duration}</p>}
                            {place.notes && <p className="text-sm mt-1">{place.notes}</p>}
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Travel Record?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the record for {place.location} ({place.year})? This cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRecord(place.id)} className="bg-destructive hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No travel records yet.</p>
                )}
            </CardContent>
        </Card>
    )
}


function FamilyHistory() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [familyHistory, setFamilyHistory] = useState('');

    useEffect(() => {
        if (!user) return;
        const key = getNamespacedKey('familyHistory', user.id);
        const storedHistory = localStorage.getItem(key);
        if (storedHistory) {
            setFamilyHistory(storedHistory);
        }
    }, [user]);

    const handleSave = () => {
        if (!user) return;
        const key = getNamespacedKey('familyHistory', user.id);
        localStorage.setItem(key, familyHistory);
        toast({
            title: "Family History Saved",
            description: "Your family history notes have been updated.",
        });
    }

    return (
        <Card className="transform transition-all duration-300 hover:shadow-xl">
            <CardHeader>
                <CardTitle>Family Medical History</CardTitle>
                <CardDescription>
                    Use this space to write down any relevant medical history for your family members (e.g., heart conditions, diabetes, genetic disorders).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    value={familyHistory}
                    onChange={(e) => setFamilyHistory(e.target.value)}
                    rows={15}
                    placeholder="e.g., Maternal grandmother had Type 2 Diabetes. Father was diagnosed with high blood pressure at age 50..."
                />
                <div className="flex justify-end">
                    <Button onClick={handleSave}>Save History</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function History() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
           <div className="space-y-8">
             <FamilyHistory />
             <TravelHistory />
           </div>
           <HealthTipsGenerator />
        </div>
    )
}
