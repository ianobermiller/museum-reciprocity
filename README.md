# Museum Finder

Find ASTC science centers and AZA zoos/aquariums with reciprocal admission benefits. Search by city and view on a map.

## Features

- Search 50+ ASTC museums and AZA institutions by location
- Filter by distance radius (10/50/100 miles)
- View results on interactive map or grid
- See admission policies and special restrictions
- Dark mode support

## Tech Stack

- Bun runtime with TypeScript
- React 19
- Tailwind CSS 4.x
- shadcn/ui components
- Leaflet maps

## Development

```bash
bun install           # Install dependencies
bun run dev           # Start dev server
bun run build         # Build for production
bun run lint          # Run ESLint
bun run format        # Format with Prettier
bun run ts            # Check TypeScript
bun run knip          # Check for unused code
```

## Data Sources

- [ASTC Travel Passport Program](https://www.astc.org/travel-passport)
- [AZA Reciprocity Chart](https://www.aza.org/)

Museum data located in `src/data/`.
