import { MapPin, Phone, ExternalLink, Navigation, Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Museum } from "@/types/museum";

interface MuseumCardProps {
  museum: Museum;
  showDistance?: boolean;
}

export function MuseumCard({ museum, showDistance }: MuseumCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${museum.phone}`;
  };

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
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300">
            <Ticket className="h-3 w-3" />
            Free Admission
          </span>
        );
      case "50-percent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300">
            <Ticket className="h-3 w-3" />
            50% Off
          </span>
        );
      case "distance-based":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300">
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

    // Check for redundant free admission policy
    if (
      museum.discountType === "free" &&
      (policy.includes("free admission") || policy.includes("free entry"))
    ) {
      return true;
    }

    // Check for redundant 50% off policy
    if (
      museum.discountType === "50-percent" &&
      (policy.includes("50%") || policy.includes("half") || policy.includes("half price"))
    ) {
      return true;
    }

    return false;
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{museum.name}</CardTitle>
          {showDistance && museum.distance !== undefined && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted whitespace-nowrap">
              {museum.distance} mi
            </span>
          )}
        </div>
        <CardDescription className="flex items-start gap-1">
          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="text-xs">
            {museum.city}, {museum.state || museum.country}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {museum.type && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
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

        {museum.admittancePolicy && !isAdmittancePolicyRedundant() && (
          <div className="text-sm">
            <p className="font-semibold text-xs text-muted-foreground mb-1">Admittance Policy:</p>
            <p className="text-sm leading-relaxed">{museum.admittancePolicy}</p>
          </div>
        )}

        {museum.specialNotes && (
          <div className="text-sm">
            <p className="font-semibold text-xs text-muted-foreground mb-1">Special Notes:</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{museum.specialNotes}</p>
          </div>
        )}

        <div className="mt-auto pt-3 grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCall}
            className="text-xs"
            title="Call museum"
          >
            <Phone className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDirections}
            className="text-xs"
            title="Get directions"
          >
            <Navigation className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleWebsite}
            className="text-xs"
            title="Visit website"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
