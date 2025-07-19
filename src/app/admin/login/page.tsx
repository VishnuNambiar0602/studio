
import { AdminLoginForm } from "../_components/admin-login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <div className="max-w-md w-full">
             <div className="flex justify-center mb-6">
                <Car className="h-10 w-10"/>
            </div>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Admin Panel</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminLoginForm />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
