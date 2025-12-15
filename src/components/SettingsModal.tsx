import { X, Search, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Museum, UserMembership } from "@/types/museum";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  museums: Museum[];
  currentMembership: UserMembership | null;
  onSave: (membership: UserMembership | null) => void;
}

export function SettingsModal({ isOpen, onClose, museums, currentMembership, onSave }: SettingsModalProps) {
  const [selectedMuseumId, setSelectedMuseumId] = useState(currentMembership?.homeMuseumId || '');
  const [address, setAddress] = useState(currentMembership?.homeAddress || '');
  const [city, setCity] = useState(currentMembership?.homeCity || '');
  const [state, setState] = useState(currentMembership?.homeState || '');
  const [zip, setZip] = useState(currentMembership?.homeZip || '');
  const [museumSearch, setMuseumSearch] = useState('');

  useEffect(() => {
    if (currentMembership) {
      setSelectedMuseumId(currentMembership.homeMuseumId);
      setAddress(currentMembership.homeAddress);
      setCity(currentMembership.homeCity);
      setState(currentMembership.homeState);
      setZip(currentMembership.homeZip);
    }
  }, [currentMembership]);

  // Filter and sort museums
  const filteredMuseums = useMemo(() => {
    const searchLower = museumSearch.toLowerCase();
    const filtered = museumSearch
      ? museums.filter(m =>
          m.name.toLowerCase().includes(searchLower) ||
          m.city.toLowerCase().includes(searchLower) ||
          m.state.toLowerCase().includes(searchLower) ||
          m.country.toLowerCase().includes(searchLower)
        )
      : [];

    // Sort alphabetically by name and limit to 50 results
    return filtered.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 50);
  }, [museums, museumSearch]);

  const selectedMuseum = useMemo(() =>
    museums.find(m => m.id === selectedMuseumId),
    [museums, selectedMuseumId]
  );

  const handleMuseumSelect = (museum: Museum) => {
    setSelectedMuseumId(museum.id);
    setMuseumSearch('');
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedMuseumId || !zip) {
      alert('Please select your home museum and enter your zip code');
      return;
    }

    const selectedMuseum = museums.find(m => m.id === selectedMuseumId);
    if (!selectedMuseum) return;

    const membership: UserMembership = {
      homeMuseumId: selectedMuseumId,
      homeMuseumName: selectedMuseum.name,
      homeAddress: address,
      homeCity: city,
      homeState: state,
      homeZip: zip,
      homeLatitude: selectedMuseum.latitude,
      homeLongitude: selectedMuseum.longitude,
    };

    onSave(membership);
    onClose();
  };

  const handleClear = () => {
    setSelectedMuseumId('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    onSave(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Membership Settings</CardTitle>
              <CardDescription>
                Configure your home museum membership and location
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="museum-search">Home Museum *</Label>

            {selectedMuseum && !museumSearch && (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedMuseum.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMuseum.city}, {selectedMuseum.state || selectedMuseum.country}
                    {selectedMuseum.type && (
                      <span className="ml-2">({selectedMuseum.type.toUpperCase()})</span>
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMuseumId('')}
                  className="ml-2 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {(!selectedMuseum || museumSearch) && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-[0.6875rem] h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  <Input
                    id="museum-search"
                    type="text"
                    placeholder="Search museums..."
                    value={museumSearch}
                    onChange={(e) => setMuseumSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {museumSearch && (
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    {filteredMuseums.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No museums found matching "{museumSearch}"
                      </div>
                    ) : (
                      <>
                        <p className="px-4 py-2 text-xs text-muted-foreground border-b bg-muted/50">
                          Showing {filteredMuseums.length} result{filteredMuseums.length !== 1 ? 's' : ''}
                          {filteredMuseums.length === 50 && ' (limited to 50)'}
                        </p>
                        <div className="divide-y">
                          {filteredMuseums.map(museum => (
                            <button
                              key={museum.id}
                              onClick={() => handleMuseumSelect(museum)}
                              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors focus:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">{museum.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {museum.city}, {museum.state || museum.country}
                                    {museum.type && (
                                      <span className="ml-2">({museum.type.toUpperCase()})</span>
                                    )}
                                  </p>
                                </div>
                                {museum.id === selectedMuseumId && (
                                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">Zip Code *</Label>
            <Input
              id="zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="12345"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>* Required fields</p>
            <p className="mt-2">
              This information is used to calculate the 90-mile exclusion zone and show you which museums you can visit.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

