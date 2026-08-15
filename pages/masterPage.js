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
    withElement(NOTIFICATION_BELL_ID, (bell) => bell.onClick(handleBellClick));

    try {
        authentication.onLogin(handleAuthStateChange);
        authentication.onLogout(handleAuthStateChange);
    } catch (err) {
        console.error('[Auth] Could not attach login/logout listeners:', err.message);
    }
});

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
