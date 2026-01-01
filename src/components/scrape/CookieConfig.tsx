import React, { useState } from 'react';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
interface Cookie {
  id: string;
  name: string;
  value: string;
}
export function CookieConfig() {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const addCookie = () => {
    setCookies([...cookies, { id: crypto.randomUUID(), name: '', value: '' }]);
  };
  const removeCookie = (id: string) => {
    setCookies(cookies.filter(c => c.id !== id));
  };
  const updateCookie = (id: string, field: keyof Cookie, val: string) => {
    setCookies(cookies.map(c => c.id === id ? { ...c, [field]: val } : c));
  };
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
        <ShieldCheck className="w-5 h-5 text-orange-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-orange-500">Security Note</p>
          <p className="text-muted-foreground">Cookies are stored only in your session and encrypted during transport to the automation engine.</p>
        </div>
      </div>
      <div className="space-y-4">
        {cookies.map((cookie) => (
          <div key={cookie.id} className="flex gap-3 items-end animate-in fade-in slide-in-from-top-1">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Cookie Name</Label>
              <Input 
                placeholder="e.g. li_at" 
                value={cookie.name}
                onChange={(e) => updateCookie(cookie.id, 'name', e.target.value)}
              />
            </div>
            <div className="flex-[2] space-y-1.5">
              <Label className="text-xs">Value</Label>
              <Input 
                type="password"
                placeholder="Paste sensitive value here" 
                value={cookie.value}
                onChange={(e) => updateCookie(cookie.id, 'value', e.target.value)}
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeCookie(cookie.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button 
          variant="outline" 
          className="w-full border-dashed"
          onClick={addCookie}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Authentication Cookie
        </Button>
      </div>
    </div>
  );
}