import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "components/ui/dialog";
import Image from "next/image";

export function AuthDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Sign in to Obby</DialogTitle>
        <DialogDescription>
          Sign in or create an account to access Obby
        </DialogDescription>
        <div className="flex justify-center items-center flex-col bg-muted">
          <h1 className="flex items-center gap-4 text-xl font-bold mb-6 w-full">
            <div className="flex items-center justify-center rounded-md shadow-md p-2">
              <Image
                src="/logos/obby/obby-logo-min.webp"
                width={32}
                height={32}
                alt={"Obby Logo"}
              />
            </div>
            Sign in to Obby
          </h1>
        </div>
      </DialogContent>
    </Dialog>
  );
}
