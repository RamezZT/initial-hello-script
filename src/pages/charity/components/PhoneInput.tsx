
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({ 
  className, 
  value, 
  onChange, 
  ...props 
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Always ensure the value starts with +
    if (!inputValue.startsWith('+') && inputValue.length > 0) {
      inputValue = '+' + inputValue;
    }
    
    // Only allow numbers and + character
    if (!/^[\+\d]*$/.test(inputValue)) {
      return;
    }
    
    onChange(inputValue);
  };

  return (
    <div className="relative">
      <div className={cn(
        "absolute inset-y-0 left-3 flex items-center pointer-events-none",
        focused ? "text-primary" : "text-muted-foreground"
      )}>
        <Phone size={16} />
      </div>
      <Input
        type="tel"
        className={cn("pl-10", className)}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
        placeholder={props.placeholder || "+1234567890"}
      />
    </div>
  );
}
