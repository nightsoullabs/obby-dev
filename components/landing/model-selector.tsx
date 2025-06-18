"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { ChevronDown, Zap, Check, Gem } from "lucide-react";
import { cn } from "lib/utils";

const models = [
  {
    id: "agentic",
    name: "Agentic",
    description: "Gemini 2.5 Pro",
    icon: Gem,
    recommended: true,
    icon_color: "text-emerald-500",
  },
  {
    id: "speed",
    name: "Speed",
    description: "Gemini 2.5 Flash",
    icon: Zap,
    recommended: false,
    icon_color: "text-yellow-500",
  },
];

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <span className="text-sm">{selectedModel.name}</span>
          <ChevronDown className="size-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {models.map((model) => {
          const Icon = model.icon;
          const isSelected = selectedModel.id === model.id;

          return (
            <DropdownMenuItem
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className="flex items-center gap-3 p-3 cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <Icon className={cn("size-4", model.icon_color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  {isSelected && <Check className="size-4" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {model.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
