import { Loader2 } from "lucide-react";

export function GlobalLoader({ fullScreen = false, message = "Loading..." }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-24 text-center flex-1">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
