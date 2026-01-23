
"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";


const languages = [
    { code: 'en', name: 'English', status: 'Enabled', progress: '100%' },
    { code: 'ar', name: 'Arabic (العربية)', status: 'Enabled', progress: '100%' },
]

export function LocalizationSettings() {
  return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
            This module allows for dynamic management of website languages. Adding a new language would typically require a full translation of all static text strings across the application.
        </p>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {languages.map(lang => (
                     <TableRow key={lang.code}>
                        <TableCell className="font-medium">{lang.name}</TableCell>
                        <TableCell>{lang.status}</TableCell>
                        <TableCell>{lang.progress}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <div className="flex justify-end">
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Language
            </Button>
        </div>
         <p className="text-xs text-muted-foreground pt-2">
            *This feature is a conceptual placeholder. A full implementation would require a backend translation management system.
        </p>
      </div>
  );
}
