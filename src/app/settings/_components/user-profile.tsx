
"use client";

import { useSettings } from "@/context/settings-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Car, Shield } from "lucide-react";

export function UserProfile() {
  const { loggedInUser } = useSettings();

  if (!loggedInUser) {
    return null; // Or a loading skeleton
  }

  const getRoleIcon = () => {
    switch (loggedInUser.role) {
      case 'vendor':
        return <Car className="h-12 w-12" />;
      case 'admin':
        return <Shield className="h-12 w-12" />;
      default:
        return <User className="h-12 w-12" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-6">
           <Avatar className="h-24 w-24 border">
                <AvatarFallback className="text-3xl bg-muted">
                    {getRoleIcon()}
                </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <CardTitle className="text-3xl">{loggedInUser.name}</CardTitle>
                <CardDescription>@{loggedInUser.username} | <span className="capitalize">{loggedInUser.role}</span></CardDescription>
            </div>
        </div>
      </CardHeader>
    </Card>
  );
}
