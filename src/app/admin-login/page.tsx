
import { AdminLoginForm } from "./_components/admin-login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

export default function AdminLoginPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Car className="mx-auto h-10 w-10 mb-4"/>
                    <CardTitle>Admin Panel</CardTitle>
                    <CardDescription>Enter your credentials to access the master control panel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AdminLoginForm />
                </CardContent>
            </Card>
        </div>
    )
}
