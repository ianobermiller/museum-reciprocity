# Museum Finder - ASTC & AZA Reciprocal Admission

A mobile-friendly web application for finding ASTC science centers and AZA zoos/aquariums that offer reciprocal admission benefits to members.

## Features

### 🎫 Reciprocal Admission Tracking

- Search through 50+ ASTC science centers and museums
- Browse AZA zoos and aquariums
- See admission policies (free admission vs 50% discount)
- Identify museums requiring proof of residence

### 📍 Location-Based Filtering

- Set your home museum membership
- Automatic 90-mile exclusion zone calculation (as per ASTC rules)
- Distance display to each museum
- Google Maps integration for directions

### 🔍 Advanced Search & Filters

- Text search by museum name, city, or state
- Filter by state/country
- Show only free admission or 50% discount venues
- Hide museums requiring proof of residence
- Sort by name, distance, or location

### 📱 Mobile-First Design

- Responsive layout (1 column mobile, 2-3 columns desktop)
- Touch-friendly interface
- PWA manifest for "Add to Home Screen"
- Safe area support for notched devices
- Click-to-call phone numbers
- One-tap directions

### 💾 Persistent Settings

- localStorage for membership information
- Saved search preferences
- No account required

## Technology Stack

- **Runtime**: Bun (instead of Node.js)
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Build**: Bun's built-in bundler

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── FilterPanel.tsx  # Search filters UI
│   ├── MuseumCard.tsx   # Individual museum display
│   ├── MuseumSearch.tsx # Main search interface
│   └── SettingsModal.tsx # User settings
├── data/
│   ├── astc-museums.json # ASTC museum data
│   └── aza-institutions.json # AZA institution data
├── lib/
│   ├── distance.ts      # Haversine distance calculations
│   ├── storage.ts       # localStorage utilities
│   └── utils.ts         # General utilities
├── types/
│   └── museum.ts        # TypeScript interfaces
├── App.tsx              # Main application component
├── frontend.tsx         # React entry point
├── index.html           # HTML template
└── index.css            # Global styles
```

## Data Sources

- **ASTC Data**: [ASTC Travel Passport Program](https://www.astc.org/wp-content/uploads/2025/05/Standard-Lists-11pt-Font-May-Update.pdf)
- **AZA Data**: [AZA Reciprocity Chart](https://assets.speakcdn.com/assets/2332/reciprocity_chart.pdf)

### Updating Museum Data

To update the museum data:

1. Download the latest PDF from ASTC/AZA
2. Parse the PDF content
3. Update `src/data/astc-museums.json` or `src/data/aza-institutions.json`
4. Ensure all required fields are present:
   - `id`, `name`, `address`, `city`, `state`, `country`, `zip`
   - `phone`, `website`, `admittancePolicy`
   - `proofOfResidenceRequired`, `latitude`, `longitude`
   - `discountType`, `specialNotes`

## Key Features Explained

### 90-Mile Exclusion Zone

Per ASTC rules, members cannot use reciprocal admission at museums:

1. Within 90 miles of their home museum
2. Within 90 miles of their residence

The app calculates straight-line distance ("as the crow flies") using the Haversine formula and automatically filters out excluded museums.

### Distance Calculation

```typescript
// Haversine formula for great-circle distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  // ... calculation
  return distance;
}
```

### Admittance Policy Parsing

The app intelligently parses admission policies to extract:

- Number of adults allowed
- Number of children allowed
- Special restrictions
- Additional fees for certain exhibits

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App support

## Contributing

When adding new museums:

1. Ensure accurate latitude/longitude coordinates
2. Clearly note any special restrictions
3. Include complete contact information
4. Verify the discount type (free, 50%, distance-based, varies)

## License

This project is for educational and personal use. Museum data is sourced from ASTC and AZA public resources.

## Acknowledgments

- [ASTC](https://www.astc.org/) for the Travel Passport Program
- [AZA](https://www.aza.org/) for the Reciprocal Admissions Program
- Museum partners for their reciprocal admission programs
