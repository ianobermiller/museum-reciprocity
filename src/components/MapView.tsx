import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { MapPin, Phone, Navigation, ExternalLink, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Museum } from '@/types/museum';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  museums: Museum[];
  showDistance?: boolean;
}

// Custom component to fit bounds when museums change
function FitBounds({ museums }: { museums: Museum[] }) {
  const map = useMap();

  useEffect(() => {
    if (museums.length === 0) return;

    const bounds = new LatLngBounds(
      museums.map(m => [m.latitude, m.longitude] as [number, number])
    );

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }, [museums, map]);

  return null;
}

// Custom marker icon
const createCustomIcon = (type: 'astc' | 'aza' | undefined) => {
  const color = type === 'astc' ? '#4f46e5' : '#10b981'; // indigo for ASTC, emerald for AZA

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <path fill="${color}" stroke="white" stroke-width="2"
              d="M16 0 C7.2 0 0 7.2 0 16 C0 24 16 40 16 40 S32 24 32 16 C32 7.2 24.8 0 16 0 Z"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

export function MapView({ museums, showDistance }: MapViewProps) {
  const mapRef = useRef<L.Map>(null);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (museum: Museum) => {
    const query = encodeURIComponent(`${museum.address}, ${museum.city}, ${museum.state} ${museum.zip}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleWebsite = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  const getDiscountLabel = (type: Museum['discountType']) => {
    switch (type) {
      case 'free':
        return 'Free Admission';
      case '50-percent':
        return '50% Off';
      case 'distance-based':
        return 'Distance-Based';
      default:
        return null;
    }
  };

  const getDiscountColor = (type: Museum['discountType']) => {
    switch (type) {
      case 'free':
        return 'bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300';
      case '50-percent':
        return 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300';
      case 'distance-based':
        return 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300';
      default:
        return '';
    }
  };

  // Default center (US center)
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 4;

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds museums={museums} />

        {museums.map((museum) => (
          <Marker
            key={`${museum.type}-${museum.id}`}
            position={[museum.latitude, museum.longitude]}
            icon={createCustomIcon(museum.type)}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <h3 className="font-bold text-base mb-1">{museum.name}</h3>

                <div className="flex items-start gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">
                    {museum.city}, {museum.state || museum.country}
                  </span>
                </div>

                {showDistance && museum.distance !== undefined && (
                  <div className="text-xs font-semibold mb-2">
                    Distance: {museum.distance} miles
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-2">
                  {museum.type && (
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                      museum.type === 'astc'
                        ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {museum.type === 'astc' ? 'ASTC' : 'AZA'}
                    </span>
                  )}
                  {getDiscountLabel(museum.discountType) && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getDiscountColor(museum.discountType)}`}>
                      <Ticket className="h-3 w-3" />
                      {getDiscountLabel(museum.discountType)}
                    </span>
                  )}
                </div>

                {museum.admittancePolicy && (
                  <div className="text-xs mb-2">
                    <p className="font-semibold text-muted-foreground mb-0.5">Policy:</p>
                    <p className="leading-relaxed">{museum.admittancePolicy}</p>
                  </div>
                )}

                {museum.specialNotes && (
                  <div className="text-xs mb-2">
                    <p className="font-semibold text-muted-foreground mb-0.5">Notes:</p>
                    <p className="leading-relaxed text-muted-foreground">{museum.specialNotes}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-1 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(museum.phone)}
                    className="text-xs px-2 py-1 h-7"
                    title="Call"
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDirections(museum)}
                    className="text-xs px-2 py-1 h-7"
                    title="Directions"
                  >
                    <Navigation className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWebsite(museum.website)}
                    className="text-xs px-2 py-1 h-7"
                    title="Website"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

