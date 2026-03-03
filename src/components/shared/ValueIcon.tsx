import { DollarSign, Calendar } from "lucide-react";

export function ValueIcon({ value }: { value: string }) {
  return value.startsWith("$") || value.startsWith("Up to") ? (
    <DollarSign className="h-4 w-4" />
  ) : (
    <Calendar className="h-4 w-4" />
  );
}
