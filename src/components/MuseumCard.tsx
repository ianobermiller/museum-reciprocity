import { MapPin, Ticket, ChevronDown } from "lucide-react";
import type { Museum } from "@/types/museum";
import { useState } from "react";

interface MuseumCardProps {
  museum: Museum;
  showDistance?: boolean;
}

export function MuseumCard({ museum, showDistance }: MuseumCardProps) {
  const [showNotes, setShowNotes] = useState(false);

  const getDiscountBadge = () => {
    switch (museum.discountType) {
      case "free":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300">
            <Ticket className="h-3 w-3" />
            Free
          </span>
        );
      case "50-percent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300">
            <Ticket className="h-3 w-3" />
            50% Off
          </span>
        );
      case "distance-based":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300">
            <Ticket className="h-3 w-3" />
            Distance-Based
          </span>
        );
      default:
        return null;
    }
  };

  // Check if the admittance policy is redundant with the discount badge
  const isAdmittancePolicyRedundant = () => {
    if (!museum.admittancePolicy) return false;
    const policy = museum.admittancePolicy.toLowerCase();

    if (
      museum.discountType === "free" &&
      (policy.includes("free admission") || policy.includes("free entry"))
    ) {
      return true;
    }

    if (
      museum.discountType === "50-percent" &&
      (policy.includes("50%") || policy.includes("half") || policy.includes("half price"))
    ) {
      return true;
    }

    return false;
  };

  const hasSpecialNotes = museum.specialNotes;

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header */}
      <div className="space-y-2">
        {/* Row 1: Name and Distance */}
        <div className="flex items-start justify-between gap-3">
          <a
            href={museum.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lg leading-snug hover:underline cursor-pointer flex-1 min-w-0"
          >
            {museum.name}
          </a>
          {showDistance && museum.distance !== undefined && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted whitespace-nowrap shrink-0">
              {museum.distance} mi
            </span>
          )}
        </div>

        {/* Row 2: Location and Badges */}
        <div className="flex items-center justify-between gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${museum.address}, ${museum.city}, ${museum.state} ${museum.zip}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-1.5 text-muted-foreground text-sm hover:text-foreground hover:underline transition-colors cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="leading-snug">
              {museum.city}, {museum.state || museum.country}
            </span>
          </a>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-end">
            {museum.type && (
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                  museum.type === "astc"
                    ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300"
                    : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                }`}
              >
                {museum.type === "astc" ? "ASTC" : "AZA"}
              </span>
            )}
            {getDiscountBadge()}
          </div>
        </div>
      </div>

      {/* Admittance Policy */}
      {museum.admittancePolicy && !isAdmittancePolicyRedundant() && (
        <p className="text-sm leading-relaxed text-foreground/90">{museum.admittancePolicy}</p>
      )}

      {/* Special Notes - Collapsible */}
      {hasSpecialNotes && (
        <div className="space-y-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showNotes ? "rotate-180" : ""}`}
            />
            <span className="font-medium">{showNotes ? "Hide notes" : "Show special notes"}</span>
          </button>
          {showNotes && (
            <p className="text-sm leading-relaxed text-muted-foreground pl-5">
              {museum.specialNotes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
