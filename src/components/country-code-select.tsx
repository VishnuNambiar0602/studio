"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ControllerRenderProps } from "react-hook-form";

// A curated list of country codes, focusing on the Gulf region and some international ones.
const countryCodes = [
    { value: '+968', label: 'Oman (+968)' },
    { value: '+971', label: 'UAE (+971)' },
    { value: '+966', label: 'Saudi Arabia (+966)' },
    { value: '+974', label: 'Qatar (+974)' },
    { value: '+965', label: 'Kuwait (+965)' },
    { value: '+973', 'label': 'Bahrain (+973)' },
    { value: '+91', label: 'India (+91)' },
    { value: '+1', label: 'USA (+1)' },
    { value: '+44', label: 'UK (+44)' },
];

interface CountryCodeSelectProps {
  field: ControllerRenderProps<any, 'countryCode'>;
}

export function CountryCodeSelect({ field }: CountryCodeSelectProps) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-[150px] shrink-0">
        <SelectValue placeholder="Code" />
      </SelectTrigger>
      <SelectContent>
        {countryCodes.map(country => (
          <SelectItem key={country.value} value={country.value}>
            {country.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}