const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Ajoute les traductions avant loadUser()
html = html.replace('const LEVELS =', `
const TRANSLATIONS = {
    fr: {
        your_coins: '💰 Tes coins',
        tap_info: 'Tape pour gagner des coins !',
        coins_hour: 'coins/heure',
        per_tap: 'par tap',
        cards_title: '🃏 Cartes',
        missions_title: '🎯 Missions',
        wheel_title: '🎰 Roue de la Fortune',
        leaderboard_title: '🏆 Classement',
        referral_title: '👥 Parrainage',
        connect_wallet: '💎 Connecter Wallet TON',
        wallet_connected: '✅ Wallet connecté !',
        spin_free: '🎰 Tour Gratuit !',
        spin_paid: '🎰 Tourner (1000 🪙)',
        spin_used: 'Tour gratuit utilisé. Prochain gratuit demain !',
        free_spin: '✨ 1 tour gratuit disponible !',
        you_won: 'Tu as gagné',
        not_enough: 'Pas assez de coins !',
        claim: 'Réclamer',
        done: '✅',
        pending: '⏳',
        nav_play: 'Jouer',
        nav_cards: 'Cartes',
        nav_missions: 'Missions',
        nav_wheel: 'Roue',
        nav_top: 'Top',
        nav_friends: 'Amis',
        invite_title: '🎁 Invite tes amis !',
        invite_desc: 'Gagne <strong style="color:#f0c040">500 coins</strong> pour chaque ami qui rejoint Kira Game !',
        copy_link: '📋 Copier mon lien',
        friends_invited: 'Amis invités',
        level_max: '👑 MAX',
    },
    en: {
        your_coins: '💰 Your coins',
        tap_info: 'Tap to earn coins!',
        coins_hour: 'coins/hour',
        per_tap: 'per tap',
        cards_title: '🃏 Cards',
        missions_title: '🎯 Missions',
        wheel_title: '🎰 Wheel of Fortune',
        leaderboard_title: '🏆 Leaderboard',
        referral_title: '👥 Referral',
        connect_wallet: '💎 Connect TON Wallet',
        wallet_connected: '✅ Wallet connected!',
        spin_free: '🎰 Free Spin!',
        spin_paid: '🎰 Spin (1000 🪙)',
        spin_used: 'Free spin used. Next free spin tomorrow!',
        free_spin: '✨ 1 free spin available!',
        you_won: 'You won',
        not_enough: 'Not enough coins!',
        claim: 'Claim',
        done: '✅',
        pending: '⏳',
        nav_play: 'Play',
        nav_cards: 'Cards',
        nav_missions: 'Missions',
        nav_wheel: 'Wheel',
        nav_top: 'Top',
        nav_friends: 'Friends',
        invite_title: '🎁 Invite your friends!',
        invite_desc: 'Earn <strong style="color:#f0c040">500 coins</strong> for each friend who joins Kira Game!',
        copy_link: '📋 Copy my link',
        friends_invited: 'Friends invited',
        level_max: '👑 MAX',
    },
    ar: {
        your_coins: '💰 عملاتك',
        tap_info: 'اضغط لكسب العملات!',
        coins_hour: 'عملة/ساعة',
        per_tap: 'لكل نقرة',
        cards_title: '🃏 البطاقات',
        missions_title: '🎯 المهام',
        wheel_title: '🎰 عجلة الحظ',
        leaderboard_title: '🏆 المتصدرين',
        referral_title: '👥 الإحالة',
        connect_wallet: '💎 ربط محفظة TON',
        wallet_connected: '✅ المحفظة متصلة!',
        spin_free: '🎰 لفة مجانية!',
        spin_paid: '🎰 الدوران (1000 🪙)',
        spin_used: 'تم استخدام اللفة المجانية. اللفة المجانية التالية غداً!',
        free_spin: '✨ لفة مجانية واحدة متاحة!',
        you_won: 'لقد فزت',
        not_enough: 'عملات غير كافية!',
        claim: 'استلام',
        done: '✅',
        pending: '⏳',
        nav_play: 'العب',
        nav_cards: 'البطاقات',
        nav_missions: 'المهام',
        nav_wheel: 'العجلة',
        nav_top: 'الأفضل',
        nav_friends: 'الأصدقاء',
        invite_title: '🎁 ادعُ أصدقاءك!',
        invite_desc: 'اكسب <strong style="color:#f0c040">500 عملة</strong> لكل صديق ينضم!',
        copy_link: '📋 نسخ الرابط',
        friends_invited: 'الأصدقاء المدعوون',
        level_max: '👑 الحد الأقصى',
    },
    es: {
        your_coins: '💰 Tus monedas',
        tap_info: '¡Toca para ganar monedas!',
        coins_hour: 'monedas/hora',
        per_tap: 'por toque',
        cards_title: '🃏 Cartas',
        missions_title: '🎯 Misiones',
        wheel_title: '🎰 Rueda de la Fortuna',
        leaderboard_title: '🏆 Clasificación',
        referral_title: '👥 Referidos',
        connect_wallet: '💎 Conectar Wallet TON',
        wallet_connected: '✅ ¡Wallet conectada!',
        spin_free: '🎰 ¡Giro Gratis!',
        spin_paid: '🎰 Girar (1000 🪙)',
        spin_used: 'Giro gratis usado. ¡Próximo giro gratis mañana!',
        free_spin: '✨ ¡1 giro gratis disponible!',
        you_won: 'Ganaste',
        not_enough: '¡No hay suficientes monedas!',
        claim: 'Reclamar',
        done: '✅',
        pending: '⏳',
        nav_play: 'Jugar',
        nav_cards: 'Cartas',
        nav_missions: 'Misiones',
        nav_wheel: 'Rueda',
        nav_top: 'Top',
        nav_friends: 'Amigos',
        invite_title: '🎁 ¡Invita a tus amigos!',
        invite_desc: 'Gana <strong style="color:#f0c040">500 monedas</strong> por cada amigo que se una!',
        copy_link: '📋 Copiar mi enlace',
        friends_invited: 'Amigos invitados',
        level_max: '👑 MÁX',
    },
    pt: {
        your_coins: '💰 Suas moedas',
        tap_info: 'Toque para ganhar moedas!',
        coins_hour: 'moedas/hora',
        per_tap: 'por toque',
        cards_title: '🃏 Cartas',
        missions_title: '🎯 Missões',
        wheel_title: '🎰 Roda da Fortuna',
        leaderboard_title: '🏆 Classificação',
        referral_title: '👥 Indicação',
        connect_wallet: '💎 Conectar Carteira TON',
        wallet_connected: '✅ Carteira conectada!',
        spin_free: '🎰 Giro Grátis!',
        spin_paid: '🎰 Girar (1000 🪙)',
        spin_used: 'Giro grátis usado. Próximo giro grátis amanhã!',
        free_spin: '✨ 1 giro grátis disponível!',
        you_won: 'Você ganhou',
        not_enough: 'Moedas insuficientes!',
        claim: 'Reivindicar',
        done: '✅',
        pending: '⏳',
        nav_play: 'Jogar',
        nav_cards: 'Cartas',
        nav_missions: 'Missões',
        nav_wheel: 'Roda',
        nav_top: 'Top',
        nav_friends: 'Amigos',
        invite_title: '🎁 Convide seus amigos!',
        invite_desc: 'Ganhe <strong style="color:#f0c040">500 moedas</strong> por cada amigo que entrar!',
        copy_link: '📋 Copiar meu link',
        friends_invited: 'Amigos convidados',
        level_max: '👑 MÁX',
    }
};

// Détecte la langue
const userLang = tg.initDataUnsafe?.user?.language_code || 'fr';
const lang = TRANSLATIONS[userLang] || TRANSLATIONS['en'];

// Applique les traductions
function applyTranslations() {
    document.querySelector('.coins-label').textContent = lang.your_coins;
    document.querySelector('.tap-info').textContent = lang.tap_info;
    document.getElementById('page-cards').querySelector('h2').textContent = lang.cards_title;
    document.getElementById('page-missions').querySelector('h2').textContent = lang.missions_title;
    document.getElementById('page-wheel').querySelector('h2').textContent = lang.wheel_title;
    document.getElementById('page-leaderboard').querySelector('h2').textContent = lang.leaderboard_title;
    document.getElementById('page-referral').querySelector('h2').textContent = lang.referral_title;
    document.getElementById('wallet-btn').innerHTML = lang.connect_wallet;
    document.getElementById('copy-btn').textContent = lang.copy_link;
    document.querySelector('.ref-stats h3').textContent = lang.friends_invited;
    document.querySelector('.ref-box h3').textContent = lang.invite_title;
    document.querySelector('.ref-box p').innerHTML = lang.invite_desc;

    // Nav
    const navBtns = document.querySelectorAll('.nav-btn');
    const navKeys = ['nav_play', 'nav_cards', 'nav_missions', 'nav_wheel', 'nav_top', 'nav_friends'];
    navBtns.forEach((btn, i) => {
        const icon = btn.querySelector('.nav-icon').textContent;
        btn.innerHTML = '<span class="nav-icon">' + icon + '</span>' + lang[navKeys[i]];
    });

    // Stats
    document.querySelectorAll('.stat-box')[0].innerHTML = '<strong id="per-hour-val">0</strong>' + lang.coins_hour;
    document.querySelectorAll('.stat-box')[1].innerHTML = '<strong id="tap-value">1</strong>' + lang.per_tap;

    // RTL pour arabe
    if (userLang === 'ar') {
        document.body.style.direction = 'rtl';
    }
}

const LEVELS =`);

// Ajoute applyTranslations() dans loadUser après updateUI()
html = html.replace(
    'updateUI();\n    } catch(e)',
    'updateUI();\n        applyTranslations();\n    } catch(e)'
);

fs.writeFileSync('public/index.html', html);
console.log('Done!');
