
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { signUpSchema, type SignUpFormData } from "./schemas/signUpSchema";
import { CharityFormFields } from "./components/CharityFormFields";
import { FileUploadField } from "./components/FileUploadField";

export default function CharitySignUp() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<File | null>(null);
  const [documents, setDocuments] = useState<FileList | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      lat: "",
      lng: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
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
            <CharityFormFields form={form} />
            
            <FileUploadField
              label="Logo"
              accept="image/*"
              onChange={(files) => setLogo(files?.[0] || null)}
            />

            <FileUploadField
              label="Documents"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={setDocuments}
            />

            <Button type="submit" className="w-full">
              Register Charity
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
