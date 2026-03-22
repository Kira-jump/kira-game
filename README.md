# Kira Game

Base de bot Telegram + mini-app tap-to-earn inspiree des jeux du type Hamster Kombat ou Catizen, sans pretendre etre un clone exact.

## Ce que le projet couvre

- bot Telegram avec bouton `web_app`
- mini-app Telegram WebApp
- taps et economie joueur
- revenus passifs et cartes
- boosts temporaires
- roue de la chance
- missions quotidiennes
- referrals
- leaderboard
- wallet TON
- notifications bot
- panneau admin
- base de configuration centralisee
- schema Supabase pret a adapter

## Fichiers importants

- [bot.js](/data/data/com.termux/files/home/kira-game/bot.js)
- [config/game-config.js](/data/data/com.termux/files/home/kira-game/config/game-config.js)
- [public/index.html](/data/data/com.termux/files/home/kira-game/public/index.html)
- [public/admin.html](/data/data/com.termux/files/home/kira-game/public/admin.html)
- [supabase/schema.sql](/data/data/com.termux/files/home/kira-game/supabase/schema.sql)
- [.env.example](/data/data/com.termux/files/home/kira-game/.env.example)
- [docs/DEPLOYMENT.md](/data/data/com.termux/files/home/kira-game/docs/DEPLOYMENT.md)

## Architecture

- `bot.js`: bot Telegram, API Express, logique serveur
- `public/index.html`: mini-app jouable dans Telegram
- `public/admin.html`: base d'administration
- `config/game-config.js`: niveaux, boosts, cartes, missions, roue, flags de features
- `supabase/schema.sql`: tables recommandées pour industrialiser le projet

## Fonctionnalites majeures visees

- tap avec energie et anti-spam
- progression par niveaux
- cartes de revenus passifs
- missions quotidiennes et one-shot
- boosts à cooldown
- referrals avec bonus
- wallet et retraits
- chat global et clans
- leaderboard global / saisonnier
- roue de chance
- promos et events
- panneau admin

## Lancement local

1. Copier `.env.example` vers `.env`
2. Remplir les variables
3. Installer les dependances
4. Lancer:

```bash
npm start
```

## Important

Ce dépôt est une base technique. Pour atteindre un niveau “production” comparable à un gros tap-to-earn, il faudra encore:

- finir le front de toutes les pages
- brancher toutes les tables Supabase
- ajouter l’anti-triche serveur
- ajouter les tests
- ajouter la moderation admin
- ajouter la logique de saison et d’airdrop

## Deploiement

Le guide de deploiement est dans [docs/DEPLOYMENT.md](/data/data/com.termux/files/home/kira-game/docs/DEPLOYMENT.md).
Recommendation pratique:

- front statique sur Vercel
- bot + API sur Railway/Render/VPS
- Supabase pour la persistance
