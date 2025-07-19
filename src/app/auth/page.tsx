
"use client";

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "./_components/auth-form";
import { LoginForm } from "./_components/login-form";
import { useSettings } from "@/context/settings-context";
import { getDictionary } from "@/lib/i18n";

export default function AuthPage() {
  const { language } = useSettings();
  const t = getDictionary(language);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 lg:py-24">
        <Tabs defaultValue="login" className="w-full max-w-lg mx-auto">
           <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.auth.login}</TabsTrigger>
            <TabsTrigger value="signup">{t.auth.signUp}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t.auth.welcomeBack}</CardTitle>
                <CardDescription>{t.auth.loginDescription}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                 <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                  <CardTitle>{t.auth.createAnAccount}</CardTitle>
                  <CardDescription>{t.auth.signUpDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="customer-signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="customer-signup">{t.auth.customer}</TabsTrigger>
                        <TabsTrigger value="vendor-signup">{t.auth.vendor}</TabsTrigger>
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
