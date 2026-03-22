# Deployment

## Architecture recommandee

- Front mini-app statique: Vercel ou Netlify
- Backend Express + bot Telegram polling: Railway, Render, VPS ou autre runtime Node persistant
- Base de donnees: Supabase

## Pourquoi ne pas tout mettre sur Vercel

Le bot Telegram en `polling: true` a besoin d'un processus Node persistant.
Vercel convient bien au front statique, mais pas a un bot polling long-lived.

## Option simple

1. Deployer `public/` sur Vercel
2. Deployer `bot.js` sur Railway ou Render
3. Pointer `APP_URL` vers le domaine du front
4. Pointer les appels API du front vers le domaine backend
5. Creer les tables avec [schema.sql](/data/data/com.termux/files/home/kira-game/supabase/schema.sql)

## Variables d'environnement backend

- `PORT`
- `APP_URL`
- `BOT_TOKEN`
- `BOT_USERNAME`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `ADMIN_SECRET`

## Variables d'environnement front

Le front actuel lit une constante `API` dans `public/index.html`.
Avant mise en production, fixe cette URL vers ton backend public.

## Checklist de production

- activer HTTPS
- verifier `BOT_USERNAME`
- importer le schema Supabase
- restreindre CORS au vrai domaine
- ajouter webhook ou garder polling sur un serveur persistant
- proteger les routes admin via `ADMIN_SECRET`
- ajouter backup et logs
