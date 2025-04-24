
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { updateCharity } from "@/lib/api";
import { Charity } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  canReceiveFunds: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface EditCharityFormProps {
  charity: Charity;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditCharityForm({ charity, onSuccess, onCancel }: EditCharityFormProps) {
  const [files, setFiles] = useState<FileList | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: charity.name,
      email: charity.email,
      phone: charity.phone,
      address: charity.address,
      canReceiveFunds: charity.canReceiveFunds,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });
      }

      await updateCharity({
        id: charity.id,
        ...data,
      });

      toast({
        title: "Success",
        description: "Charity updated successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating charity:", error);
      toast({
        title: "Error",
        description: "Failed to update charity",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charity Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter charity name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="canReceiveFunds"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Can receive funds</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Logo</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Update Charity</Button>
        </div>
      </form>
    </Form>
  );
}
