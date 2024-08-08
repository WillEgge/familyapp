import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="text-2xl font-semibold mt-4">Loading...</h2>
        <p className="text-muted-foreground mt-2">
          Please wait while we fetch your data.
        </p>
      </div>
    </div>
  );
}
