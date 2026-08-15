import { authentication } from '@wix/site';
import * as wixSiteMembers from '@wix/site-members';

/**
 * GUESSED element IDs — not verified against the actual Editor component tree
 * (no API exposes that). Confirm/correct these against the real IDs for the
 * login button, avatar, and notification bell before relying on this file.
 */
const LOGIN_BUTTON_ID = '#loginButton';
const USER_AVATAR_ID = '#userAvatar';
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
    refreshAuthUI();

    withElement(LOGIN_BUTTON_ID, (btn) => btn.onClick(handleAuthButtonClick));
    withElement(NOTIFICATION_BELL_ID, (bell) => bell.onClick(handleBellClick));
});

function refreshAuthUI() {
    const loggedIn = authentication.loggedIn();

    withElement(LOGIN_BUTTON_ID, (btn) => {
        btn.label = loggedIn ? 'Log Out' : 'Log In';
    });

    withElement(USER_AVATAR_ID, (avatar) => {
        if (loggedIn) {
            avatar.show();
        } else {
            avatar.hide();
        }
    });
}

async function handleAuthButtonClick() {
    try {
        if (authentication.loggedIn()) {
            await authentication.logout();
        } else {
            await wixSiteMembers.promptLogin();
        }
    } catch (err) {
        // Visitor closed the login modal without signing in, or logout failed — no crash, just no state change.
        console.error('[Auth] Login/logout did not complete:', err.message);
    }
    refreshAuthUI();
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
