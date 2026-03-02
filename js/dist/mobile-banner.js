
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('mobile-app-banner');
    const closeBtn = document.querySelector('.close-banner');
    const downloadLink = document.querySelector('.banner-content');
    
    if (!banner) return;

    // Check if user dismissed the banner in the last 7 days
    const dismissalTime = localStorage.getItem('mobileBannerDismissed');
    const now = new Date().getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (dismissalTime && (now - dismissalTime < sevenDays)) {
        return; // Don't show the banner
    }

    // Detect Device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let isMobile = false;
    let storeUrl = '';

    if (/android/i.test(userAgent)) {
        isMobile = true;
        storeUrl = 'https://play.google.com/store/apps/details?id=com.logames.izradafotografija';
        document.querySelector('.app-info p').innerText = 'Dostupno na Google Play';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        isMobile = true;
        storeUrl = 'https://apps.apple.com/rs/app/izrada-fotografija/id6479988921';
        document.querySelector('.app-info p').innerText = 'Dostupno na App Store';
        // Change icon for iOS if needed
        const icon = document.querySelector('.app-icon i');
        if (icon) {
            icon.className = 'fab fa-apple';
        }
    }

    if (isMobile) {
        downloadLink.href = storeUrl;
        banner.style.display = 'flex';
    }

    // Close button logic
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        banner.style.display = 'none';
        localStorage.setItem('mobileBannerDismissed', new Date().getTime());
    });
});
