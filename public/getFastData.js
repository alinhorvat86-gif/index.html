import { local } from 'wix-storage';
import wixData from 'wix-data';

const CACHE_TTL_MS = 300000; // 5 minute

/**
 * Încarcă datele cu viteză maximă folosind o strategie de caching de top.
 * @param {string} collectionName - Numele bazei tale de date din Wix.
 * @returns {Promise<Array>} Listă de elemente optimizată.
 */
export async function getFastData(collectionName) {
    const cacheKey = `cached_${collectionName}`;
    const cachedRaw = local.getItem(cacheKey);

    // 1. Dacă datele există deja în cache și nu au expirat, le returnăm instant
    if (cachedRaw) {
        const cachedEntry = JSON.parse(cachedRaw);
        if (Date.now() < cachedEntry.expiresAt) {
            console.log(`%c [Cache Hit] Datele pentru ${collectionName} au fost încărcate instant.`, 'color: #00ff00');
            return cachedEntry.items;
        }
        local.removeItem(cacheKey);
    }

    // 2. Dacă nu, le luăm din baza de date și salvăm o copie în cache pentru data viitoare
    try {
        const results = await wixData.query(collectionName).limit(50).find();
        const items = results.items;

        // Salvăm în cache pentru 5 minute (300.000 milisecunde)
        local.setItem(cacheKey, JSON.stringify({ items, expiresAt: Date.now() + CACHE_TTL_MS }));
        return items;
    } catch (error) {
        console.error("Eroare la optimizarea bazei de date:", error);
        // Fallback: în caz de eroare, returnăm o listă goală ca să nu se blocheze site-ul
        return [];
    }
}
