
"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";


const languages = [
    { code: 'en', name: 'English', progress: '100%' },
    { code: 'ar', name: 'Arabic (العربية)', progress: '100%' },
]

export function LocalizationSettings() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
            {t.admin.localization.description}
        </p>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t.admin.localization.tableHeaders.language}</TableHead>
                    <TableHead>{t.admin.localization.tableHeaders.status}</TableHead>
                    <TableHead>{t.admin.localization.tableHeaders.progress}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {languages.map(lang => (
                     <TableRow key={lang.code}>
                        <TableCell className="font-medium">{lang.name}</TableCell>
                        <TableCell>{t.admin.localization.enabled}</TableCell>
                        <TableCell>{lang.progress}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <div className="flex justify-end">
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" /> {t.admin.localization.addNewLanguage}
            </Button>
        </div>
         <p className="text-xs text-muted-foreground pt-2">
            {t.admin.localization.placeholder}
        </p>
      </div>
  );
}
