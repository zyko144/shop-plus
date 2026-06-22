import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Settings = Record<string, string>;

const SettingsContext = createContext<Settings>({});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("store_settings").select("*");
      if (data) {
        const map: Settings = {};
        data.forEach(s => map[s.key] = s.value);
        setSettings(map);
      }
    };
    
    fetchSettings();
    
    // Listen for changes
    const channel = supabase.channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, () => {
        fetchSettings();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
