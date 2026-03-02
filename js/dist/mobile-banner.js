
document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('mobile-app-banner');
    const closeBtn = document.querySelector('.close-banner');
    const downloadLink = document.querySelector('.banner-content');

    if (!banner) return;

    // 1. Check if user dismissed the banner in the last 7 days
    const dismissalTime = localStorage.getItem('mobileBannerDismissed');
    const now = new Date().getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (dismissalTime && (now - dismissalTime < sevenDays)) {
        banner.style.display = 'none'; // Keep hidden
        return;
    }

    // 2. Detect Device (Android or iOS)
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let isMobile = false;
    let storeUrl = '';

    if (/android/i.test(userAgent)) {
        isMobile = true;
        storeUrl = 'https://play.google.com/store/apps/details?id=com.logames.izradafotografija';
        const statusText = document.querySelector('.app-info p');
        if (statusText) statusText.innerText = 'Dostupno na Google Play';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        isMobile = true;
        storeUrl = 'https://apps.apple.com/rs/app/izrada-fotografija/id6479988921';
        const statusText = document.querySelector('.app-info p');
        if (statusText) statusText.innerText = 'Dostupno na App Store';

        // Change icon to Apple brand for iOS devices
        const icon = document.querySelector('.app-icon i');
        if (icon) {
            icon.className = 'fab fa-apple';
        }
    }

    // 3. Set link and show banner if device is mobile
    if (isMobile) {
        if (downloadLink) downloadLink.href = storeUrl;
        banner.style.display = 'flex';
    } else {
        banner.style.display = 'none'; // Hide on desktop devices
    }

    // 4. Close button logic - save dismissal to localStorage
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            banner.style.display = 'none';
            localStorage.setItem('mobileBannerDismissed', new Date().getTime());
        });
    }
});