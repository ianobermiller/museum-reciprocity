import { MapPin, Ticket, ChevronDown } from "lucide-react";
import type { Museum } from "@/types/museum";
import { useState } from "react";

interface MuseumCardProps {
  museum: Museum;
  showDistance?: boolean;
}

export function MuseumCard({ museum, showDistance }: MuseumCardProps) {
  const [showNotes, setShowNotes] = useState(false);

  const handleDirections = () => {
    const query = encodeURIComponent(
      `${museum.address}, ${museum.city}, ${museum.state} ${museum.zip}`
    );
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleWebsite = () => {
    window.open(museum.website, "_blank", "noopener,noreferrer");
  };

  const getDiscountBadge = () => {
    switch (museum.discountType) {
      case "free":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300">
            <Ticket className="h-3 w-3" />
            Free
          </span>
        );
      case "50-percent":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300">
            <Ticket className="h-3 w-3" />
            50% Off
          </span>
        );
      case "distance-based":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300">
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
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={museum.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleWebsite();
            }}
            className="font-semibold text-base leading-tight mb-1 hover:underline cursor-pointer block"
          >
            {museum.name}
          </a>
          <button
            onClick={handleDirections}
            className="flex items-start gap-1 text-muted-foreground text-xs hover:text-foreground hover:underline transition-colors cursor-pointer"
          >
            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
            <span>
              {museum.city}, {museum.state || museum.country}
            </span>
          </button>
        </div>
        {showDistance && museum.distance !== undefined && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted whitespace-nowrap">
            {museum.distance} mi
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {museum.type && (
          <span
            className={`inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded-full ${
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

      {/* Admittance Policy */}
      {museum.admittancePolicy && !isAdmittancePolicyRedundant() && (
        <p className="text-xs leading-relaxed">{museum.admittancePolicy}</p>
      )}

      {/* Special Notes - Collapsible */}
      {hasSpecialNotes && (
        <div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showNotes ? "rotate-180" : ""}`}
            />
            <span className="font-medium">{showNotes ? "Hide notes" : "Show special notes"}</span>
          </button>
          {showNotes && (
            <p className="text-xs leading-relaxed text-muted-foreground mt-2 pl-4">
              {museum.specialNotes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
