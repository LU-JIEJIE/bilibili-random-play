import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://www.bilibili.com/favicon.ico',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.bilibili.com/video/*'],
        version:'1.0',
        author:'lu-jiejie',
        homepage:'https://github.com/LU-JIEJIE/bilibili-random-play'
      },
    }),
  ],
});
