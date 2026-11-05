import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {cpSync,writeFileSync,mkdirSync} from 'node:fs';
export default defineConfig({base:'./',plugins:[react(),{name:'publish-catalog',closeBundle(){mkdirSync('docs/data',{recursive:true});cpSync('data/curated.json','docs/data/curated.json');cpSync('data/magic.json','docs/data/magic.json');writeFileSync('docs/CNAME','soberi-urok.ru\n');writeFileSync('docs/.nojekyll','');}}],build:{outDir:'docs',emptyOutDir:true,target:'es2022'}});
