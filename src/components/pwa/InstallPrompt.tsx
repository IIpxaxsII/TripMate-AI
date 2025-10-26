import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useToast } from '@/hooks/use-toast';

export const InstallPrompt = () => {
  const { isInstallable, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);
  const { toast } = useToast();

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      toast({
        title: "App installed!",
        description: "TripMate AI is now available on your home screen"
      });
    }
  };

  if (!isInstallable || isDismissed) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 shadow-lg animate-slide-in-bottom z-50">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-sm">Install TripMate AI</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Get quick access and work offline
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleInstall} className="flex-1">
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
