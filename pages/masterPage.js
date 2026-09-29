import wixSeoFrontend from 'wix-seo-frontend';
import wixWindowFrontend from 'wix-window-frontend';
import wixLocationFrontend from 'wix-location-frontend';
import { authentication } from '@wix/site';

/**
 * '#membersLoginBar2' is the real Wix native MembersLoginBar component
 * (confirmed against the live Editor). It's a self-contained widget: it
 * already renders its own logged-in/logged-out UI and handles its own
 * login/logout clicks internally, so this file does not reference it
 * directly or attach a custom onClick to it — doing so would fight its
 * built-in modal instead of complementing it. Everything below only reacts
 * to the auth state that widget drives, via authentication.onLogin/onLogout.
 *
 * The bell IDs below are still GUESSES — not verified against the Editor's
 * component tree, since no available API exposes that tree. Confirm/correct
 * them before relying on this file.
 */
const NOTIFICATION_BELL_ID = '#notificationBell';
const NOTIFICATION_DROPDOWN_ID = '#notificationDropdown';
const NOTIFICATION_TEXT_ID = '#notificationText';

/** Runs fn only if the element ID exists on this page; $w() throws (not returns null/undefined) on a missing ID, so a truthy check alone can't guard it. */
function withElement(id, fn) {
    try {
        const el = $w(id);
        fn(el);
    } catch (err) {
        // Element not present on this page/breakpoint — nothing to do.
    }
}

$w.onReady(function () {
    console.log("%c[ISS-Elite-Engine] Toate sistemele sunt online. Consonlă curată.", "color: #00ff00; font-weight: bold; font-size: 14px;");

    // 1. Execută optimizările și corecțiile de metadate SEO
    ruleazaCorectiiMetadateSEO();

    // 2. Activează datele unificate de afaceri pentru Google (LocalBusiness)
    injecteazaSeoUnificat();

    // 3. Activează calibrarea automată a textelor la încărcarea paginii
    ajusteazaEcranPerfect();

    // Monitorizare dinamică la redimensionarea ecranului (Debounce fluid)
    let debounceTimer;
    wixWindowFrontend.getBoundingRect().then((windowSizeInfo) => {
        let latimeAnterioara = windowSizeInfo.window.width;

        setInterval(() => {
            wixWindowFrontend.getBoundingRect().then((infoCurent) => {
                if (infoCurent.window.width !== latimeAnterioara) {
                    latimeAnterioara = infoCurent.window.width;

                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        ajusteazaEcranPerfect();
                    }, 150);
                }
            });
        }, 400);
    });

    // 4. Clopoțel de notificări + sincronizare cu starea de autentificare
    withElement(NOTIFICATION_BELL_ID, (bell) => bell.onClick(handleBellClick));

    try {
        authentication.onLogin(handleAuthStateChange);
        authentication.onLogout(handleAuthStateChange);
    } catch (err) {
        console.error('[Auth] Could not attach login/logout listeners:', err.message);
    }
});

function ruleazaCorectiiMetadateSEO() {
    const caleCurenta = wixLocationFrontend.path;

    if (caleCurenta && caleCurenta.includes('book-online')) {
        wixSeoFrontend.setTitle("Book Private Security & Concierge Services | ISS")
            .then(() => {
                return wixSeoFrontend.setDescription("Book elite close protection, professional security guards, and premium concierge management services online with International Security System.");
            }).catch(e => {});
    }

    if (caleCurenta && caleCurenta.includes('privacy-policy')) {
        wixSeoFrontend.setDescription("Read the Privacy Policy for International Security System (ISS). Learn how we protect and manage your private data and security information in London.")
            .catch(e => {});
    }

    if (caleCurenta && caleCurenta.includes('our-services')) {
        const primuTitluServicii = $w('#text233') || $w('#textMask2');
        if (primuTitluServicii && typeof primuTitluServicii.html !== 'undefined') {
            try {
                let textNativ = primuTitluServicii.text || "Our Security Services in London";
                primuTitluServicii.html = `<h1 style="font-size:40px; text-align:center; font-family:Helvetica,sans-serif; font-weight:bold;"><span style="color:#FFFFFF;">${textNativ}</span></h1>`;
            } catch(e) {}
        }
    }
}

function injecteazaSeoUnificat() {
    const schemaUnificata = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "International Security System (ISS)",
        "image": "https://wixstatic.com",
        "url": "https://internationalsecuritysystem.com",
        "telephone": "+440000000000",
        "email": "contact@internationalsecuritysystem.com",
        "priceRange": "$$$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "11 Second Avenue",
            "addressLocality": "London",
            "addressRegion": "Hendon",
            "postalCode": "NW4 2RR",
            "addressCountry": "GB"
        },
        "geo": { "@type": "GeoCoordinates", "latitude": 51.5833, "longitude": -0.2281 },
        "description": "Professional security guards, 24/7 CCTV monitoring services, and drone surveillance in Hendon, London. Elite corporate and private security solutions.",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Security Services",
            "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Professional Security Guards" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "24/7 CCTV Monitoring" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Drone Surveillance" } }
            ]
        }
    };
    wixSeoFrontend.setStructuredData([schemaUnificata]).catch(err => {});
}

function ajusteazaEcranPerfect() {
    const tipDispozitiv = wixWindowFrontend.formFactor;
    wixWindowFrontend.getBoundingRect().then((dateEcran) => {
        const latime = dateEcran.window.width;
        let scaraTitluMare = latime > 1920 ? "54px" : (latime >= 1200 ? "40px" : (latime >= 768 ? "32px" : "22px"));
        let scaraTitluMediu = latime > 1920 ? "36px" : (latime >= 1200 ? "28px" : (latime >= 768 ? "24px" : "18px"));
        let scaraTextMic = latime > 1920 ? "20px" : (latime >= 1200 ? "18px" : (latime >= 768 ? "16px" : "14px"));

        const tMask = $w('#textMask2');
        const t47 = $w('#text47');
        const t233 = $w('#text233');

        // NOTĂ: #text2 (adresa din secțiunea Contact) a fost eliminat deliberat
        // de aici — acest bloc suprascria stilul (roșu, Fahkwang) setat manual
        // în Editor cu alb/bold/Helvetica la fiecare încărcare și redimensionare.
        if (tMask && typeof tMask.html !== 'undefined') { try { tMask.html = `<h1 style="font-size:${scaraTitluMare}; text-align:center; font-family:Helvetica,sans-serif;"><span style="color:#4A4AEA;">${tMask.text}</span></h1>`; } catch(e){} }
        if (t47 && typeof t47.html !== 'undefined') { try { t47.html = `<p style="font-size:${scaraTextMic}; text-align:center; font-family:Helvetica,sans-serif;"><span style="color:#D1D1D1;">${t47.text}</span></p>`; } catch(e){} }
        if (t233 && typeof t233.html !== 'undefined') { try { t233.html = `<p style="font-size:${scaraTitluMediu}; text-align:center; font-family:monospace;"><span style="color:#111111;">${t233.text}</span></p>`; } catch(e){} }
    });
}

function handleAuthStateChange() {
    const loggedIn = authentication.loggedIn();

    // Clear any stale "please log in" prompt once the visitor logs in.
    if (loggedIn) {
        withElement(NOTIFICATION_TEXT_ID, (text) => {
            text.text = '';
        });
    } else {
        // Collapse the notification dropdown on logout so no member-specific
        // content stays visible to what is now an anonymous visitor.
        withElement(NOTIFICATION_DROPDOWN_ID, (dropdown) => dropdown.collapse());
    }
}

function handleBellClick() {
    if (!authentication.loggedIn()) {
        withElement(NOTIFICATION_TEXT_ID, (text) => {
            text.text = 'Te rugăm să te conectezi pentru a vedea notificările.';
        });
        return;
    }

    withElement(NOTIFICATION_DROPDOWN_ID, (dropdown) => {
        if (dropdown.collapsed) {
            dropdown.expand();
        } else {
            dropdown.collapse();
        }
    });
}
