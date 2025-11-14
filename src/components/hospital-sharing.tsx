"use client";

import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Share2, FileDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { TimelineEvent } from './timeline-view';
import { useAuth } from '@/hooks/use-auth';
import { getNamespacedKey } from '@/lib/utils';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

export default function HospitalSharing() {
    const { user } = useAuth();
    const { toast } = useToast();

    const generatePdf = () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to generate a PDF.' });
            return;
        }

        const personalInfo = {
            name: user.name || 'N/A',
            age: localStorage.getItem(getNamespacedKey('age', user.id)) || 'N/A',
            height: localStorage.getItem(getNamespacedKey('height', user.id)) || 'N/A',
            weight: localStorage.getItem(getNamespacedKey('weight', user.id)) || 'N/A',
        };
        const timeline: TimelineEvent[] = JSON.parse(localStorage.getItem(getNamespacedKey('timeline', user.id)) || '[]');
        const familyHistoryText = localStorage.getItem(getNamespacedKey('familyHistory', user.id)) || '';
        const travelHistory = JSON.parse(localStorage.getItem(getNamespacedKey('travelHistory', user.id)) || '[]');
        
        const doc = new jsPDF() as jsPDFWithAutoTable;

        doc.setFontSize(20);
        doc.text("Health Record Summary", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        
        // Personal Info
        doc.setFontSize(16);
        doc.text("Personal Information", 14, 35);
        doc.autoTable({
            startY: 40,
            body: [
                ['Name', personalInfo.name],
                ['Age', personalInfo.age],
                ['Height', personalInfo.height],
                ['Weight', personalInfo.weight],
            ],
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [79, 70, 229] },
        });

        let lastY = (doc as any).lastAutoTable.finalY + 15;

        const addSection = (title: string, data: any[], columns: any[], mapper: (item: any) => any[]) => {
            if (data.length > 0) {
                if (lastY > 250) { // Add new page if content is getting long
                    doc.addPage();
                    lastY = 20;
                }
                doc.setFontSize(16);
                doc.text(title, 14, lastY);
                doc.autoTable({
                    startY: lastY + 5,
                    head: [columns],
                    body: data.map(mapper),
                    theme: 'grid',
                    styles: { fontSize: 10, cellPadding: 2 },
                    headStyles: { fillColor: [79, 70, 229] },
                });
                lastY = (doc as any).lastAutoTable.finalY + 15;
            }
        };

        const doctorVisits = timeline.filter(e => e.type === 'Doctor Visit');
        const medications = timeline.filter(e => e.type === 'Medication');
        const diseases = timeline.filter(e => e.type === 'Disease');

        addSection('Doctor Visits', doctorVisits, ['Date', 'Reason', 'Type', 'Diagnosis', 'Prescription'], (item) => [
            new Date(item.date).toLocaleDateString(),
            item.title,
            item.details?.visitType || '',
            item.details?.diseaseName || '',
            item.details?.medicationsPrescribed || ''
        ]);
        
        addSection('Medications', medications, ['Date Started', 'Medication', 'Status', 'Reason'], (item) => [
             new Date(item.date).toLocaleDateString(),
             item.title,
             item.details?.status || 'Stopped',
             item.description
        ]);

        addSection('Diagnosed Diseases', diseases, ['Date', 'Disease', 'Notes'], (item) => [
            new Date(item.date).toLocaleDateString(),
            item.title,
            item.description
        ]);

        if (familyHistoryText) {
            if (lastY > 250) {
                doc.addPage();
                lastY = 20;
            }
            doc.setFontSize(16);
            doc.text("Family History", 14, lastY);
            doc.setFontSize(10);
            const splitText = doc.splitTextToSize(familyHistoryText, 180);
            doc.text(splitText, 14, lastY + 8);
            lastY += splitText.length * 5 + 15;
        }

        addSection('Travel History', travelHistory, ['Year', 'Location', 'Duration', 'Notes'], (item) => [
            item.year,
            item.location,
            item.duration,
            item.notes
        ]);

        doc.save(`Health_Record_${personalInfo.name.replace(/ /g, '_')}_${new Date().toLocaleDateString()}.pdf`);
        
        toast({ title: 'PDF Generated', description: 'Your health record PDF is being downloaded.' });
    };

    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                         <Share2 className="h-6 w-6" />
                        <CardTitle>Share Your Health Record</CardTitle>
                    </div>
                    <CardDescription>
                        Generate a PDF file of your health data to share with a medical professional. Your data remains on your device until you choose to share the downloaded file.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex justify-center">
                        <Button onClick={generatePdf} size="lg">
                            <FileDown className="mr-2 h-5 w-5" />
                            Generate & Download PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
             <Alert className="mt-6">
                <AlertTitle>How it Works</AlertTitle>
                <AlertDescription>
                   When you click the button, all your health data is gathered from local browser storage and compiled into a PDF document, which is then downloaded to your device. No data is stored on any server.
                </AlertDescription>
            </Alert>
        </div>
    );
}
