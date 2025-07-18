
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Mon", visitors: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Tue", visitors: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Wed", visitors: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Thu", visitors: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Fri", visitors: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sat", visitors: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sun", visitors: Math.floor(Math.random() * 5000) + 1000 },
];

export function AdminTrafficChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
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
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            contentStyle={{ 
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
            }}
          />
          <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
