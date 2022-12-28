import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  extract: {
    include: ['**/*.{jsx,js,tsx,ts,css,html}'],
    exclude: ['node_modules', '.git', '.next'],
  },
});
