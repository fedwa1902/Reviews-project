import {
  Settings2,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Save,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function SettingsPage() {
  const [toggles, setToggles] = useState<SettingToggle[]>([
    { id: 'email-notifications', label: 'Email Notifications', description: 'Receive email alerts for new review assignments', enabled: true },
    { id: 'auto-archive', label: 'Auto-Archive', description: 'Automatically archive workspaces with no activity for 90 days', enabled: false },
    { id: 'require-confirmation', label: 'Require Confirmation', description: 'Show confirmation dialog before submitting reviews', enabled: true },
    { id: 'dark-mode-auto', label: 'Auto Dark Mode', description: 'Switch to dark mode based on system preference', enabled: true },
    { id: 'weekly-digest', label: 'Weekly Digest', description: 'Send a weekly summary of review progress', enabled: true },
    { id: 'slack-integration', label: 'Slack Integration', description: 'Send notifications to your Slack channel', enabled: false },
  ]);

  const toggle = (id: string) => {
    setToggles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const settingSections = [
    {
      title: 'General',
      icon: <Settings2 className="h-4 w-4" />,
      color: 'from-blue-500 to-cyan-500',
      items: [
        { label: 'Organization Name', type: 'input' as const, value: 'Contoso Ltd' },
        { label: 'Admin Email', type: 'input' as const, value: 'admin@contoso.com' },
        { label: 'Default Review Period', type: 'input' as const, value: '30 days' },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      color: 'from-amber-500 to-orange-500',
      toggleIds: ['email-notifications', 'weekly-digest', 'slack-integration'],
    },
    {
      title: 'Security',
      icon: <Shield className="h-4 w-4" />,
      color: 'from-emerald-500 to-teal-500',
      toggleIds: ['require-confirmation', 'auto-archive'],
    },
    {
      title: 'Appearance',
      icon: <Palette className="h-4 w-4" />,
      color: 'from-violet-500 to-purple-500',
      toggleIds: ['dark-mode-auto'],
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-base mt-1">
            Configure your admin portal preferences and organization settings.
          </p>
        </div>
        <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {settingSections.map((section) => (
        <Card key={section.title} className="border-border/60">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${section.color} text-white`}>
              {section.icon}
            </div>
            <CardTitle className="text-lg font-heading">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {/* Input fields */}
            {'items' in section &&
              section.items?.map((item, i) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between py-4">
                    <label className="text-sm font-medium">{item.label}</label>
                    <Input
                      defaultValue={item.value}
                      className="max-w-xs h-9"
                    />
                  </div>
                  {i < (section.items?.length ?? 0) - 1 && <Separator className="bg-border/40" />}
                </div>
              ))}

            {/* Toggle fields */}
            {'toggleIds' in section &&
              section.toggleIds?.map((toggleId, i) => {
                const t = toggles.find((t) => t.id === toggleId);
                if (!t) return null;
                return (
                  <div key={t.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </div>
                      <button
                        onClick={() => toggle(t.id)}
                        className="cursor-pointer relative transition-colors"
                        aria-label={`Toggle ${t.label}`}
                      >
                        {t.enabled ? (
                          <ToggleRight className="h-7 w-7 text-primary" />
                        ) : (
                          <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {i < (section.toggleIds?.length ?? 0) - 1 && <Separator className="bg-border/40" />}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      ))}

      {/* Connected Integrations */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-white">
            <Globe className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-heading">Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[
              { name: 'Microsoft Entra ID', status: 'Connected', desc: 'User authentication & SSO' },
              { name: 'Microsoft Graph', status: 'Connected', desc: 'Workspace and license data sync' },
              { name: 'Slack', status: 'Not connected', desc: 'Team notifications' },
              { name: 'ServiceNow', status: 'Not connected', desc: 'ITSM ticket integration' },
            ].map((integration, i) => (
              <div key={integration.name}>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{integration.name}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          integration.status === 'Connected'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-500/10 text-slate-500'
                        }`}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{integration.desc}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="cursor-pointer text-xs">
                    Configure
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                {i < 3 && <Separator className="bg-border/40" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
