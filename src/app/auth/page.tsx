import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "./_components/auth-form";
import { LoginForm } from "./_components/login-form";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 lg:py-24">
        <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="customer-signup">Customer</TabsTrigger>
            <TabsTrigger value="vendor-signup">Vendor</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
             <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customer-signup">
            <Card>
              <CardHeader>
                <CardTitle>Customer Sign Up</CardTitle>
                <CardDescription>Create an account to start shopping and track your orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm userType="customer" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vendor-signup">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Registration</CardTitle>
                <CardDescription>Join our platform to list your parts and reach more customers.</CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm userType="vendor" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
