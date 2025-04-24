
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
}

export function FileUploadField({ label, accept, multiple, onChange }: FileUploadFieldProps) {
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onChange(e.target.files)}
        />
      </FormControl>
      <FormMessage />
    </div>
  );
}

