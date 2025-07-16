
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
        <Tabs defaultValue="login" className="w-full max-w-lg mx-auto">
           <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Tabs defaultValue="customer-login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="customer-login">Customer</TabsTrigger>
                        <TabsTrigger value="vendor-login">Vendor</TabsTrigger>
                    </TabsList>
                    <TabsContent value="customer-login" className="pt-4">
                        <LoginForm />
                    </TabsContent>
                    <TabsContent value="vendor-login" className="pt-4">
                        <LoginForm />
                    </TabsContent>
                 </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Choose your account type to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="customer-signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="customer-signup">I'm a Customer</TabsTrigger>
                        <TabsTrigger value="vendor-signup">I'm a Vendor</TabsTrigger>
                    </TabsList>
                    <TabsContent value="customer-signup" className="pt-6">
                        <AuthForm userType="customer" />
                    </TabsContent>
                    <TabsContent value="vendor-signup" className="pt-6">
                        <AuthForm userType="vendor" />
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
