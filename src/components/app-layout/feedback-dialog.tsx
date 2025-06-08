"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Frown, Meh, Smile } from "lucide-react";

export default function FeedbackModal() {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log("Feedback:", feedback);
    console.log("Reaction:", selectedReaction);
    setFeedback("");
    setSelectedReaction(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 justify-center bg-background/50 border-border/50 hover:bg-accent/50"
        >
          {/* <MessageSquare className="size-4" /> */}
          Feedback
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Give feedback</DialogTitle>
            <DialogDescription>
              {
                "We'd love to hear what went well or how we can improve the product experience."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] resize-none"
              required
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={selectedReaction === "sad" ? "default" : "outline"}
                size="icon"
                onClick={() =>
                  setSelectedReaction(selectedReaction === "sad" ? null : "sad")
                }
              >
                <Frown className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant={selectedReaction === "neutral" ? "default" : "outline"}
                size="icon"
                onClick={() =>
                  setSelectedReaction(
                    selectedReaction === "neutral" ? null : "neutral",
                  )
                }
              >
                <Meh className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant={selectedReaction === "happy" ? "default" : "outline"}
                size="icon"
                onClick={() =>
                  setSelectedReaction(
                    selectedReaction === "happy" ? null : "happy",
                  )
                }
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 ml-auto">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!feedback.trim()}>
                Submit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
