import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Park N Pay',
    short_name: 'ParkNPay',
    description: 'City Council Of Penang Island Smart Parking',
    start_url: '/',
    display: 'standalone', // This hides the browser search bar!
    background_color: '#ffffff',
    theme_color: '#fb923c', // Matches the orange header
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}