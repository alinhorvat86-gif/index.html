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
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $w('#submitServiceBtn').onClick(async () => {
        const email = $w('#emailInput').value;
        if (!EMAIL_PATTERN.test(email)) {
            $w('#notificationText').text = "Te rugăm să introduci o adresă de email validă.";
            return;
        }

        $w('#submitServiceBtn').disable(); // Previne click-ul dublu

        const clientRequest = {
            clientEmail: email,
            requestedService: "CCTV_MONITORING_LONDON"
        };

        try {
            const result = await registerLiveService(clientRequest);
            if (result.success) {
                $w('#notificationText').text = "Rezervare înregistrată live pe server.";
            }
        } catch (err) {
            $w('#notificationText').text = "A apărut o eroare la trimiterea cererii. Încearcă din nou.";
        } finally {
            $w('#submitServiceBtn').enable();
        }
    });
});
