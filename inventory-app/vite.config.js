import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Tailwind's Vite plugin belongs at top-level, not inside Babel plugins
    tailwindcss(),
    react({
      babel: {
        // Babel plugin entries should be strings, functions, or [plugin, options]
        plugins: [
          'babel-plugin-react-compiler',
        ],
      },
    }),
  ],
})
