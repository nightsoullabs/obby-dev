import { Button } from "@/components/ui/button";
import { useSandpackNavigation } from "@codesandbox/sandpack-react";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

export function SandpackRefreshButton() {
  const { refresh } = useSandpackNavigation();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await refresh();
    setIsSaving(false);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isSaving}
      onClick={handleSave}
      className="h-7 px-2"
    >
      {isSaving ? (
        <>
          <div className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
          Refreshing...
        </>
      ) : (
        <>
          <RefreshCcw className="size-3 mr-2" />
          Refresh
        </>
      )}
    </Button>
  );
}
