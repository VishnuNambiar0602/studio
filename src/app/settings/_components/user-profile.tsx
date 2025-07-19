
"use client";

import { useSettings } from "@/context/settings-context";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Car } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

export function UserProfile() {
  const { loggedInUser, language } = useSettings();
  const t = getDictionary(language);

  if (!loggedInUser) {
    return null; // Or a loading skeleton
  }

  const getRoleIcon = () => {
    switch (loggedInUser.role) {
      case 'vendor':
        return <Car className="h-12 w-12" />;
      default:
        return <User className="h-12 w-12" />;
    }
  };

  const getRoleDisplayName = () => {
      switch (loggedInUser.role) {
          case 'admin': return t.settings.roles.admin;
          case 'vendor': return t.settings.roles.vendor;
          default: return t.settings.roles.customer;
      }
  }

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
                <CardDescription>@{loggedInUser.username} | <span className="capitalize">{getRoleDisplayName()}</span></CardDescription>
            </div>
        </div>
      </CardHeader>
    </Card>
  );
}
