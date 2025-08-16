
import { AdminLoginForm } from "./_components/admin-login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <Car className="mx-auto h-10 w-10 mb-4" />
          <CardTitle className="text-2xl">Admin Panel Login</CardTitle>
          <CardDescription>
            Enter your administrator credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
