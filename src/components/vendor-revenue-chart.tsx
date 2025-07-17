
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMonthlyRevenue } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useSettings } from "@/context/settings-context";

interface MonthlyRevenue {
    name: string;
    total: number;
}

export function VendorRevenueChart() {
  const [data, setData] = useState<MonthlyRevenue[]>([]);
  const { loggedInUser } = useSettings();

  useEffect(() => {
    async function fetchRevenue() {
        if (loggedInUser?.name) {
            const revenueData = await getMonthlyRevenue(loggedInUser.name);
            setData(revenueData);
        }
    }
    fetchRevenue();
  }, [loggedInUser]);


  return (
    <Card className="xl:col-span-2">
        <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
                A summary of your sales over the last year.
            </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
            <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
            />
            <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
            />
            <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
            />
            </BarChart>
        </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}
