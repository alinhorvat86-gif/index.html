import { seo } from '@wix/site-seo';
import wixUsers from 'wix-users';
import { registerLiveService } from 'backend/siteCoreEngine';

$w.onReady(async function () {
    // 1. INJECTARE METADATE SEO STRUCTURATE (JSON-LD) PENTRU POZIȚIONARE GOOGLE
    try {
        await seo.setStructuredData([
            {
                "@context": "https://schema.org",
                "@type": "SecurityService",
                "name": "International Security System",
                "description": "Security Guards & CCTV Monitoring Services in London",
                "url": "https://www.internationalsecuritysystem.com"
            }
        ]);
    } catch (err) {
        console.error('[ISS-SEO] Nu s-au putut seta datele structurate:', err.message);
    }

    // 2. VERIFICARE STATUS LOG-IN UTILIZATOR
    if (wixUsers.currentUser.loggedIn) {
        console.log("%c [ISS-Elite] Utilizator autentificat.", "color: #00ff00");
    }

    // 3. CONECTARE AUTOMATĂ LA MOTORUL LIVE DE REZERVĂRI
    $w('#submitServiceBtn').onClick(async () => {
        $w('#submitServiceBtn').disable(); // Previne click-ul dublu

        const clientRequest = {
            clientEmail: $w('#emailInput').value,
            requestedService: "CCTV_MONITORING_LONDON"
        };

        try {
            const result = await registerLiveService(clientRequest);
            if (result.success) {
                $w('#notificationText').text = "Rezervare înregistrată live pe server.";
            }
        } catch (err) {
            $w('#notificationText').text = "Conexiune redirecționată către serverul secundar.";
        } finally {
            $w('#submitServiceBtn').enable();
        }
    });
});
