/**
 * Script de securitate de nivel Enterprise pentru curățarea textului introduse de utilizatori.
 * @param {string} dirtyInput - Textul brut trimis din formular.
 * @returns {string} Textul curățat și securizat.
 */
export function sanitizeUserInput(dirtyInput) {
    if (!dirtyInput || typeof dirtyInput !== 'string') return '';

    return dirtyInput
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;")
        .trim(); // Elimină spațiile inutile de la început și sfârșit
}
