"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "components/ui/dialog";
import { ClientSignInButton } from "@/components/app-layout/client-sign-in-button";
import { ClientSignUpButton } from "@/components/app-layout/client-sign-up-button";
import Image from "next/image";

export function AuthDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen(open: boolean): void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="flex flex-col items-center justify-center rounded-md shadow-md p-2 gap-x-2 text-2xl">
          <Image
            src="/logos/obby/obby-logo-min.webp"
            width={64}
            height={64}
            alt={"Obby Logo"}
          />
          Sign in to Obby
        </DialogTitle>
        <DialogDescription className="flex items-center justify-center p-2 text-md">
          To use Obby, create an account or log into an existing one.
        </DialogDescription>
        <ClientSignUpButton large />
        <ClientSignInButton large />
      </DialogContent>
    </Dialog>
  );
}
