
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAiInteractions } from "@/lib/actions";
import type { AiInteraction } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, MousePointerClick, ShoppingCart } from "lucide-react";


export function AiInteractionLog() {
    const [interactions, setInteractions] = useState<AiInteraction[]>([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        async function fetchData() {
            const data = await getAiInteractions();
            setInteractions(data);
        }
        fetchData();
    }, []);

    const filteredInteractions = interactions.filter(interaction => {
        if (filter === 'all') return true;
        if (filter === 'clicked') return interaction.clicked;
        if (filter === 'ordered') return interaction.ordered;
        return true;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>AI Interaction Log</CardTitle>
                        <CardDescription>A log of all suggestions made by the AI and the user's follow-up actions.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Filter by:</span>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Interactions</SelectItem>
                                <SelectItem value="clicked">Clicked Suggestions</SelectItem>
                                <SelectItem value="ordered">Led to Order</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Suggested Part</TableHead>
                            <TableHead>User Query</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Clicked</TableHead>
                            <TableHead>Ordered</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInteractions.length > 0 ? (
                            filteredInteractions.map(interaction => (
                                <TableRow key={interaction.id}>
                                    <TableCell className="font-medium">{interaction.partName}</TableCell>
                                    <TableCell className="text-muted-foreground">{interaction.userQuery}</TableCell>
                                    <TableCell>{formatDistanceToNow(interaction.timestamp)} ago</TableCell>
                                    <TableCell>
                                        <Badge variant={interaction.clicked ? "secondary" : "outline"}>
                                            {interaction.clicked ? <MousePointerClick className="mr-2 h-3.5 w-3.5 text-blue-500" /> : null}
                                            {interaction.clicked ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={interaction.ordered ? "secondary" : "outline"}>
                                            {interaction.ordered ? <ShoppingCart className="mr-2 h-3.5 w-3.5 text-green-600"/> : null}
                                            {interaction.ordered ? "Yes" : "No"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                No interactions found for this filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
