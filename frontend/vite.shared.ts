import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

/**
 * Configuração comum aos dois apps. Cada app tem seu próprio index.html,
 * pasta public, porta e saída de build, mas compartilha `src/`.
 */
export function createAppConfig(app: 'gestor' | 'motorista', port: number) {
  return defineConfig({
    root: fileURLToPath(new URL(`./apps/${app}`, import.meta.url)),
    envDir: projectRoot,
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '/src': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
            'global-builtin',
            'color-functions',
            'if-function',
          ],
        },
      },
    },
    server: { port, strictPort: true, host: true },
    preview: { port, strictPort: true, host: true },
    build: {
      outDir: fileURLToPath(new URL(`./dist/${app}`, import.meta.url)),
      emptyOutDir: true,
    },
  })
}
