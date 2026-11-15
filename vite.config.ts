import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deneme bağlantısı alt klasörde açılabilsin diye yollar göreli.
export default defineConfig({
  base: './',
  plugins: [react()],
});
