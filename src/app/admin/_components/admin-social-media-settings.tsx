
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/settings-context";
import { useToast } from "@/hooks/use-toast";
import { Instagram, Facebook, Link as LinkIcon, Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

type SocialPlatform = "instagram" | "facebook" | "twitter";

export function AdminSocialMediaSettings() {
  const { socialLinks, setSocialLink } = useSettings();
  const { toast } = useToast();

  const [urls, setUrls] = useState({
    instagram: socialLinks.instagram.url,
    facebook: socialLinks.facebook.url,
    twitter: socialLinks.twitter.url,
  });

  const handleUrlChange = (platform: SocialPlatform, value: string) => {
    setUrls(prev => ({ ...prev, [platform]: value }));
  };
  
  const handleToggle = (platform: SocialPlatform, checked: boolean) => {
      setSocialLink(platform, { ...socialLinks[platform], isEnabled: checked });
      toast({
          title: `Link ${checked ? "Enabled" : "Disabled"}`,
          description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} link will now ${checked ? 'be shown' : 'be hidden'}.`,
      });
  };
  
  const handleSaveUrls = () => {
    setSocialLink('instagram', { ...socialLinks.instagram, url: urls.instagram });
    setSocialLink('facebook', { ...socialLinks.facebook, url: urls.facebook });
    setSocialLink('twitter', { ...socialLinks.twitter, url: urls.twitter });

    toast({
      title: "Social Links Saved!",
      description: "Your social media URLs have been updated.",
    });
  };

  const socialConfig = [
    { platform: "instagram", Icon: Instagram, isEnabled: socialLinks.instagram.isEnabled },
    { platform: "facebook", Icon: Facebook, isEnabled: socialLinks.facebook.isEnabled },
    { platform: "twitter", Icon: XIcon, isEnabled: socialLinks.twitter.isEnabled },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" /> Social Media Links</CardTitle>
        <CardDescription>
          Manage the social media links that appear in your website's footer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialConfig.map(({ platform, Icon, isEnabled }) => (
          <div key={platform} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 space-y-4 sm:space-y-0">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <Icon className="h-6 w-6 text-muted-foreground"/>
                <div className="relative flex-grow">
                     <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id={`${platform}-url`}
                        placeholder={`https://www.${platform}.com/your-page`}
                        value={urls[platform]}
                        onChange={(e) => handleUrlChange(platform, e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
                 <Label htmlFor={`${platform}-toggle`} className="text-sm text-muted-foreground">Show Link</Label>
                <Switch
                    id={`${platform}-toggle`}
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleToggle(platform, checked)}
                />
            </div>
          </div>
        ))}
        <div className="flex justify-end">
            <Button onClick={handleSaveUrls}>Save URLs</Button>
        </div>
      </CardContent>
    </Card>
  );
}
