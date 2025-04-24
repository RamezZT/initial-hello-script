import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Charity name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  confirmPassword: z.string(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function CharitySignUp() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      
      const { confirmPassword, ...submissionData } = data;
      Object.entries(submissionData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (logo) {
        formData.append("image", logo);
      }

      if (documents) {
        Array.from(documents).forEach((file) => {
          formData.append("docs", file);
        });
      }

      const response = await fetch("/api/charity", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create charity");
      }

      toast({
        title: "Success",
        description: "Charity created successfully",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error creating charity:", error);
      toast({
        title: "Error",
        description: "Failed to create charity",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Register your charity
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm password" type="password" {...field} />
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

            <div className="space-y-2">
              <FormLabel>Logo</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Documents</FormLabel>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={(e) => setDocuments(e.target.files)}
              />
            </div>

            <Button type="submit" className="w-full">
              Register Charity
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
