import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Kine Gest: Gestión Kinesiológica",
        short_name: "Kine Gest",
        description:
          "Gestión integral de pacientes, sesiones y fichas en kinesiología.",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#ADD8E6",
        background_color: "#E0FFFF",
        icons: [
          {
            "src": "public/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "public/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "public/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "public/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
      },
    }),
  ],
});
