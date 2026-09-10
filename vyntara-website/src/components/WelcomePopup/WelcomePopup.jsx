import { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './WelcomePopup.css';
import vyntaraLogo from "../../assets/vyntara-logo.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';

const STORAGE_PREFIX = 'vyntara_popup_seen_';

const canShowPopup = (popup) => {
  if (!popup?.is_active) return false;

  const now = Date.now();
  if (popup.start_date && now < new Date(popup.start_date).getTime()) return false;
  if (popup.end_date && now > new Date(popup.end_date).getTime()) return false;

  const frequency = popup.display_frequency || 'once_per_session';
  if (frequency === 'every_visit') return true;

  const key = `${STORAGE_PREFIX}${popup.id}`;
  const seenAt = Number(localStorage.getItem(key) || 0);
  if (!seenAt) return true;

  if (frequency === 'once_per_session') {
    return false;
  }

  if (frequency === 'once_per_day') {
    return now - seenAt >= 24 * 60 * 60 * 1000;
  }

  if (frequency === 'once_per_7_days') {
    return now - seenAt >= 7 * 24 * 60 * 60 * 1000;
  }

  return true;
};

const markPopupSeen = (popup) => {
  if (!popup?.id || popup.display_frequency === 'every_visit') return;
  localStorage.setItem(`${STORAGE_PREFIX}${popup.id}`, String(Date.now()));
};

const resolveButtonUrl = (url) => {
  if (!url) return '#';
  return url;
};

function WelcomePopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPopup = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/popup`);
        if (!response.ok) return;

        const data = await response.json();
        const popupData = data?.popup || data?.data || null;

        if (cancelled || !popupData || !canShowPopup(popupData)) return;

        setPopup(popupData);
        setVisible(true);
        markPopupSeen(popupData);
      } catch (error) {
        console.error('Website popup loading error:', error);
      }
    };

    loadPopup();

    return () => {
      cancelled = true;
    };
  }, []);

  const closePopup = () => setVisible(false);

  const handleCta = () => {
    const url = resolveButtonUrl(popup?.button_url);
    setVisible(false);

    if (url.startsWith('/#')) {
      window.location.href = url;
      return;
    }

    if (url.startsWith('#')) {
      document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {visible && popup && (
        <motion.div
          className="welcome-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={popup.title || 'Vyntara announcement'}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePopup();
          }}
        >
          <motion.div
            className="welcome-popup-card"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="welcome-popup-close"
              onClick={closePopup}
              aria-label="Close popup"
            >
              <X size={19} />
            </button>

            <div className="welcome-popup-brand">
              <img src={vyntaraLogo} alt="Vyntara Technologies" />
              <div>
                <strong>VYNTARA</strong>
                <span>TECHNOLOGIES</span>
              </div>
            </div>

            {popup.image_url ? (
              <img
                className="welcome-popup-image"
                src={popup.image_url}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="welcome-popup-logo-hero">
                <img src={vyntaraLogo} alt="Vyntara Technologies" />
              </div>
            )}

            <div className="welcome-popup-content">
              <span className="welcome-popup-eyebrow">DIGITAL SOLUTIONS. ENDLESS POSSIBILITIES.</span>
              <h2>{popup.title}</h2>
              <p>{popup.description}</p>
            </div>

            {popup.button_enabled !== false && popup.button_text && popup.button_url && (
              <button type="button" className="welcome-popup-cta" onClick={handleCta}>
                {popup.button_text}
                <ArrowUpRight size={17} />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomePopup;
