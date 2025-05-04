// @ts-check
import { defineConfig } from 'astro/config';

import analogjsangular from '@analogjs/astro-angular';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from '@angular/compiler-cli';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                '@angular/': resolve(_dirname, 'node_modules/@angular/'),
            },
        },
    },
    integrations: [
        analogjsangular({
            vite: {
                inlineStylesExtension: 'scss',
            },
        }),
    ],
    output: 'server',
});
