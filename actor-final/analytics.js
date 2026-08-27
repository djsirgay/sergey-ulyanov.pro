(() => {
  const MEASUREMENT_ID = 'G-RQBHK9BCRX';
  const CONSENT_KEY = 'heyitissergey-analytics-consent-v1';
  const SITE_VARIANT = 'actor_portfolio';
  const banner = document.querySelector('#analytics-consent');
  let trackingReady = false;

  const send = (name, parameters = {}) => {
    if (!window.__heyItIsSergeyAnalytics || typeof window.gtag !== 'function') return;
    window.gtag('event', name, { site_variant: SITE_VARIANT, ...parameters });
  };

  const classifyLink = element => {
    const href = element.getAttribute('href') || '';
    const text = (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    if (element.matches('[data-photo-index]')) return { name: 'casting_photo_open', parameters: { photo_index: Number(element.dataset.photoIndex) + 1 } };
    if (element.matches('[data-campaign]')) return { name: 'campaign_interest', parameters: { campaign: element.dataset.campaign } };
    if (href === '#reel') return { name: 'reel_open', parameters: { link_text: text } };
    if (href === '#contact' || href.startsWith('mailto:') || href.startsWith('tel:')) return { name: 'agent_contact', parameters: { contact_method: href.startsWith('mailto:') ? 'email' : href.startsWith('tel:') ? 'phone' : 'section' } };
    if (/Sergey_Ulyanov_Resume\.pdf|drive\.google\.com/.test(href) && /résumé|resume/i.test(text)) return { name: 'resume_open', parameters: { link_text: text } };
    if (/actorsaccess\.com|imdb\.com|backstage\.com|instagram\.com|youtube\.com\/ulyanoow/.test(href)) {
      const profile = href.includes('actorsaccess.com') ? 'actors_access' : href.includes('imdb.com') ? 'imdb' : href.includes('backstage.com') ? 'backstage' : href.includes('instagram.com') ? 'instagram' : 'youtube';
      return { name: 'industry_profile_open', parameters: { profile } };
    }
    if (href === '/privacy.html' || href === '/' || href === '/about/' || href.startsWith('/#')) return { name: 'navigation_click', parameters: { destination: href } };
    if (href.startsWith('http')) {
      try { return { name: 'outbound_click', parameters: { link_domain: new URL(href).hostname, link_text: text } }; } catch {}
    }
    return null;
  };

  const setupInteractionTracking = () => {
    if (trackingReady) return;
    trackingReady = true;

    document.addEventListener('click', event => {
      const element = event.target.closest('a[href], [data-photo-index]');
      if (!element) return;
      const eventData = classifyLink(element);
      if (eventData) send(eventData.name, eventData.parameters);
    });

    const reel = document.querySelector('#reel');
    if (reel && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          send('reel_section_view');
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(reel);
    }

    const depthMarks = [25, 50, 75, 90];
    const seenDepth = new Set();
    const reportDepth = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      if (available <= 0) return;
      const depth = Math.min(100, Math.round(scrollY / available * 100));
      depthMarks.forEach(mark => {
        if (depth >= mark && !seenDepth.has(mark)) {
          seenDepth.add(mark);
          send('scroll_depth', { percent_scrolled: mark });
        }
      });
    };
    addEventListener('scroll', reportDepth, { passive: true });

    const parameters = new URLSearchParams(location.search);
    let referralHost = '';
    try { referralHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch {}
    if (parameters.get('utm_source') === 'chatgpt.com' || /(^|\.)chatgpt\.com$/.test(referralHost)) {
      send('chatgpt_referral', { referral_source: 'chatgpt.com' });
    }
  };

  const setupReelPlaybackTracking = () => {
    const iframe = document.querySelector('#commercial-reel-player');
    if (!iframe || iframe.dataset.analyticsPlayerReady === 'true') return;
    iframe.dataset.analyticsPlayerReady = 'true';
    let firstPlay = true;

    const mountPlayer = () => {
      if (!window.YT || typeof window.YT.Player !== 'function') return;
      new window.YT.Player(iframe, {
        events: {
          onStateChange: event => {
            if (event.data !== window.YT.PlayerState.PLAYING) return;
            send('reel_play', { video_id: 'xgd7Q4ECHSE', first_play: firstPlay });
            firstPlay = false;
          }
        }
      });
    };

    if (window.YT && typeof window.YT.Player === 'function') mountPlayer();
    else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousReady === 'function') previousReady();
        mountPlayer();
      };
      if (!document.querySelector('script[data-youtube-iframe-api]')) {
        const script = document.createElement('script');
        script.async = true;
        script.dataset.youtubeIframeApi = 'true';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }
  };

  const loadAnalytics = () => {
    if (window.__heyItIsSergeyAnalytics) return;
    window.__heyItIsSergeyAnalytics = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      site_variant: SITE_VARIANT
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
    setupInteractionTracking();
    setupReelPlaybackTracking();
  };

  let choice = '';
  try { choice = localStorage.getItem(CONSENT_KEY) || ''; } catch {}
  if (choice === 'accepted') loadAnalytics();
  else if (!choice && banner) banner.hidden = false;

  banner?.querySelectorAll('[data-analytics-consent]').forEach(button => {
    button.addEventListener('click', () => {
      const accepted = button.dataset.analyticsConsent === 'accept';
      try { localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined'); } catch {}
      banner.hidden = true;
      if (accepted) {
        loadAnalytics();
        send('analytics_consent', { consent_choice: 'accepted' });
      }
    });
  });
})();
