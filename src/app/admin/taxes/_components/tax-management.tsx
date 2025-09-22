
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, ArrowLeftRight, History, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// --- Mock Data ---
// In a real app, this data would come from your database via a server action.
const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  { id: 'txn_1', date: '2024-08-01', type: 'Sale', subtype: 'Part Sale', amount: 150.00, isVATEligible: true },
  { id: 'txn_2', date: '2024-08-01', type: 'Expense', subtype: 'Marketing', amount: -75.00, isVATEligible: false },
  { id: 'txn_3', date: '2024-08-02', type: 'Sale', subtype: 'Part Sale', amount: 220.50, isVATEligible: true },
  { id: 'txn_4', date: '2024-08-03', type: 'Payout', subtype: 'Vendor Payout', amount: -180.00, isVATEligible: false },
  { id: 'txn_5', date: '2024-08-04', type: 'Expense', subtype: 'Utilities', amount: -120.00, isVATEligible: false },
  { id: 'txn_6', date: '2024-08-05', type: 'Sale', subtype: 'Part Sale', amount: 80.00, isVATEligible: true },
  { id: 'txn_7', date: '2024-07-15', type: 'Sale', subtype: 'Part Sale', amount: 300.00, isVATEligible: true },
  { id: 'txn_8', date: '2024-07-16', type: 'Expense', subtype: 'Software', amount: -50.00, isVATEligible: true },
  { id: 'txn_9', date: '2024-07-20', type: 'Payout', subtype: 'Vendor Payout', amount: -250.00, isVATEligible: false },
];

// --- Types ---
type FinancialTransaction = {
  id: string;
  date: string;
  type: 'Sale' | 'Expense' | 'Payout';
  subtype: string;
  amount: number;
  isVATEligible: boolean;
};

type SortKey = keyof FinancialTransaction;
type SortDirection = 'asc' | 'desc';

export function TaxManagement() {
  const [mainSheet, setMainSheet] = useState<FinancialTransaction[]>([]);
  const [backupSheet, setBackupSheet] = useState<FinancialTransaction[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'date', direction: 'desc' });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching initial data
    setMainSheet(MOCK_TRANSACTIONS);
  }, []);

  const handleMoveToBackup = () => {
    if (selectedRows.size === 0) {
      toast({ variant: 'destructive', title: "No transactions selected." });
      return;
    }
    const itemsToMove = mainSheet.filter(txn => selectedRows.has(txn.id));
    const remainingItems = mainSheet.filter(txn => !selectedRows.has(txn.id));
    
    setMainSheet(remainingItems);
    setBackupSheet(prev => [...prev, ...itemsToMove]);
    setSelectedRows(new Set());
    toast({ title: `${itemsToMove.length} transaction(s) moved to backup.` });
  };

  const handleRestoreFromBackup = (idsToRestore: string[]) => {
    if (idsToRestore.length === 0) {
      toast({ variant: 'destructive', title: "No transactions selected to restore." });
      return;
    }
    const itemsToRestore = backupSheet.filter(txn => idsToRestore.includes(txn.id));
    const remainingBackup = backupSheet.filter(txn => !idsToRestore.includes(txn.id));

    setMainSheet(prev => [...prev, ...itemsToRestore]);
    setBackupSheet(remainingBackup);
    toast({ title: `${itemsToRestore.length} transaction(s) restored.` });
  };
  
  const sortedMainSheet = useMemo(() => {
    let sortableItems = [...mainSheet];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [mainSheet, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const financials = useMemo(() => {
    const grossSales = mainSheet.filter(t => t.type === 'Sale').reduce((acc, t) => acc + t.amount, 0);
    const vendorPayouts = mainSheet.filter(t => t.type === 'Payout').reduce((acc, t) => acc + t.amount, 0);
    const expenses = mainSheet.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    
    // Commission is implied by the difference between sales and payouts, simplified here
    const commissionEarned = grossSales + vendorPayouts; // Payouts are negative
    const netProfit = commissionEarned + expenses; // Expenses are negative
    const vatPayable = mainSheet.filter(t => t.isVATEligible).reduce((acc, t) => acc + (t.amount * 0.05), 0);
    const corporateTax = Math.max(0, netProfit * 0.15); // Tax on positive profit only
    const incomeAfterTax = netProfit - corporateTax;

    return { grossSales, vendorPayouts, commissionEarned, expenses, netProfit, vatPayable, corporateTax, incomeAfterTax };
  }, [mainSheet]);

  const downloadCSV = () => {
    const headers = ["ID", "Date", "Type", "Subtype", "Amount (OMR)"];
    const rows = sortedMainSheet.map(t => [t.id, t.date, t.type, t.subtype, t.amount.toFixed(2)]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    
    const financialSummary = [
        ["\n"],
        ["Financial Summary"],
        ["Gross Sales", financials.grossSales.toFixed(2)],
        ["Vendor Payouts", financials.vendorPayouts.toFixed(2)],
        ["Commission Earned", financials.commissionEarned.toFixed(2)],
        ["Expenses", financials.expenses.toFixed(2)],
        ["Net Profit", financials.netProfit.toFixed(2)],
        ["VAT (5%)", financials.vatPayable.toFixed(2)],
        ["Corporate Tax (15%)", financials.corporateTax.toFixed(2)],
        ["Income After Tax", financials.incomeAfterTax.toFixed(2)],
    ];

    csvContent += financialSummary.map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `tax_sheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Net Profit" value={financials.netProfit} isProfit />
        <StatCard title="Gross Sales" value={financials.grossSales} />
        <StatCard title="Total Expenses" value={financials.expenses} />
        <StatCard title="Corporate Tax (15%)" value={financials.corporateTax * -1} />
      </div>

      {/* Main Tax Sheet */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Main Tax Sheet</CardTitle>
              <CardDescription>This data is used for all calculations and reports. {mainSheet.length} transactions visible.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button onClick={handleMoveToBackup} variant="outline" disabled={selectedRows.size === 0}><Trash2 className="mr-2 h-4 w-4"/> Move to Backup</Button>
                <RestoreFromBackupDialog backupSheet={backupSheet} onRestore={handleRestoreFromBackup} />
                <Button onClick={downloadCSV}><Download className="mr-2 h-4 w-4"/> Download Sheet</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">
                    <Checkbox
                        checked={selectedRows.size === mainSheet.length && mainSheet.length > 0}
                        onCheckedChange={(checked) => {
                        const newSelectedRows = new Set<string>();
                        if (checked) {
                            mainSheet.forEach(row => newSelectedRows.add(row.id));
                        }
                        setSelectedRows(newSelectedRows);
                        }}
                    />
                    </TableHead>
                    <TableHead><button onClick={() => requestSort('date')} className="flex items-center">Date {getSortIcon('date')}</button></TableHead>
                    <TableHead><button onClick={() => requestSort('type')} className="flex items-center">Type {getSortIcon('type')}</button></TableHead>
                    <TableHead><button onClick={() => requestSort('subtype')} className="flex items-center">Subtype {getSortIcon('subtype')}</button></TableHead>
                    <TableHead className="text-right"><button onClick={() => requestSort('amount')} className="flex items-center w-full justify-end">Amount (OMR) {getSortIcon('amount')}</button></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sortedMainSheet.map(txn => (
                    <TableRow key={txn.id}>
                    <TableCell>
                        <Checkbox
                        checked={selectedRows.has(txn.id)}
                        onCheckedChange={(checked) => {
                            const newSelectedRows = new Set(selectedRows);
                            if (checked) {
                            newSelectedRows.add(txn.id);
                            } else {
                            newSelectedRows.delete(txn.id);
                            }
                            setSelectedRows(newSelectedRows);
                        }}
                        />
                    </TableCell>
                    <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                    <TableCell><Badge variant={txn.type === 'Sale' ? 'secondary' : 'outline'}>{txn.type}</Badge></TableCell>
                    <TableCell>{txn.subtype}</TableCell>
                    <TableCell className={`text-right font-mono ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{txn.amount.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const StatCard = ({ title, value, isProfit = false }: { title: string; value: number, isProfit?: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold font-mono ${isProfit ? (value >= 0 ? 'text-green-600' : 'text-red-600') : ''}`}>
                {Math.abs(value).toFixed(2)} OMR
            </div>
        </CardContent>
    </Card>
);

const RestoreFromBackupDialog = ({ backupSheet, onRestore }: { backupSheet: FinancialTransaction[], onRestore: (ids: string[]) => void }) => {
    const [selectedToRestore, setSelectedToRestore] = useState<Set<string>>(new Set());
    const [isOpen, setIsOpen] = useState(false);

    const handleRestoreClick = () => {
        onRestore(Array.from(selectedToRestore));
        setSelectedToRestore(new Set());
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={backupSheet.length === 0}><History className="mr-2 h-4 w-4" /> Restore from Backup</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Restore from Backup</DialogTitle>
                    <DialogDescription>Select transactions to restore to the main sheet. {backupSheet.length} items in backup.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                 <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedToRestore.size === backupSheet.length && backupSheet.length > 0}
                                        onCheckedChange={(checked) => {
                                            const newSelected = new Set<string>();
                                            if (checked) backupSheet.forEach(row => newSelected.add(row.id));
                                            setSelectedToRestore(newSelected);
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {backupSheet.map(txn => (
                                <TableRow key={txn.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedToRestore.has(txn.id)}
                                            onCheckedChange={(checked) => {
                                                const newSelected = new Set(selectedToRestore);
                                                if (checked) newSelected.add(txn.id);
                                                else newSelected.delete(txn.id);
                                                setSelectedToRestore(newSelected);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{txn.type}</TableCell>
                                    <TableCell className="text-right font-mono">{txn.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
                <DialogFooter>
                    <Button onClick={handleRestoreClick} disabled={selectedToRestore.size === 0}>Restore Selected ({selectedToRestore.size})</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
