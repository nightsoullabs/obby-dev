import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ModelInfo } from "@/lib/ai/models";
import type { TemplateId, Templates } from "@/lib/templates";
import "core-js/features/object/group-by.js";
import Image from "next/image";

export function ChatPicker({
  templates,
  selectedTemplate,
  onSelectedTemplateChange,
  models,
  languageModel,
  onLanguageModelChange,
}: {
  templates: Templates;
  selectedTemplate: "auto" | TemplateId;
  onSelectedTemplateChange: (template: "auto" | TemplateId) => void;
  models: ModelInfo[];
  languageModel: ModelInfo;
  onLanguageModelChange: (config: ModelInfo) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col">
        <Select
          name="languageModel"
          defaultValue={languageModel.id}
          onValueChange={(modelId) => {
            const selectedModel = models.find((model) => model.id === modelId);
            if (selectedModel) {
              onLanguageModelChange(selectedModel);
            }
          }}
        >
          <SelectTrigger className="whitespace-nowrap border-none shadow-none focus:ring-0 px-2 py-0 h-6 text-xs">
            <SelectValue placeholder="Language model" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(
              Object.groupBy(models, ({ provider }) => provider || "unknown"),
            ).map(([provider, models]) => (
              <SelectGroup key={provider}>
                <SelectLabel>{provider}</SelectLabel>
                {models?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center space-x-2">
                      <Image
                        className="flex"
                        src={`/logos/ai/${model.image}`}
                        alt={model.provider || "AI Provider"}
                        width={14}
                        height={14}
                      />
                      <span>{model.name || model.id}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
