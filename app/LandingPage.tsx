import Image from 'next/image';
import Link from 'next/link';
import AuthStatus from '@/components/AuthStatus';
import LandingAlphabet from '@/components/LandingAlphabet';
import {
  LandingAlphabetTitle,
  LandingCourseTitle,
  LandingFinalCtaTitle,
  LandingLanguagePicker,
  LandingRestaurantBill,
  LandingReadingReasons,
} from '@/components/LandingCourseTitle';

export const landingMetadata = {
  title: 'Deda - учимся читать на разных языках играя.',
  description:
    'Грузинский, английский, испанский, немецкий, сербский и турецкий: слушай буквы, читай карточки и закрепляй чтение в игре.',
};

export default function LandingPage() {
  const landingStyles = `
    .header-control-btn--alphabet {
      display: none !important;
    }

    .landing-shell {
      overflow-x: clip;
      background: var(--deda-gradient-aurora) !important;
    }

    .landing-section {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding-inline: 16px;
    }

    .landing-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .landing-brand {
      color: #171513;
      font-size: clamp(24px, 2.4vw, 30px);
      font-weight: 880;
      letter-spacing: -0.055em;
      line-height: 1;
    }

    .landing-topbar .header-control-btn--menu {
      width: 44px;
      min-height: 44px;
      color: #171513;
      background: rgba(255, 255, 255, 0.72) !important;
      box-shadow:
        0 12px 26px rgba(31, 28, 23, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.82);
    }

    .landing-hero-grid {
      align-items: center;
      gap: clamp(26px, 4.2vw, 64px);
      min-height: clamp(560px, 70vh, 720px);
    }

    .landing-copy {
      max-width: min(100%, 650px);
      position: relative;
      z-index: 1;
      padding-top: clamp(4px, 1vw, 12px);
    }

    .landing-copy p {
      text-wrap: balance;
    }

    .landing-subtitle {
      max-width: 620px;
      text-wrap: pretty;
      margin-top: clamp(16px, 1.8vw, 22px) !important;
    }

    .landing-title {
      max-width: 620px;
      color: var(--text-primary);
      font-weight: 900;
      letter-spacing: -0.055em;
      text-wrap: balance;
    }

    .landing-title-accent {
      color: #f26d2d;
    }

    .landing-title-play {
      white-space: nowrap;
    }

    .landing-course-label {
      margin-top: clamp(22px, 2.6vw, 30px);
      color: #171513;
      font-size: 15px;
      font-weight: 720;
      letter-spacing: -0.025em;
    }

    .landing-course-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      width: min(100%, 560px);
      margin-top: 12px;
    }

    .landing-course-button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      min-height: 48px;
      border-radius: 17px;
      border: 1px solid transparent;
      background: rgba(255, 255, 255, 0.72);
      padding: 0 13px;
      color: #28231e;
      font-size: 14px;
      font-weight: 740;
      letter-spacing: -0.02em;
      box-shadow:
        0 10px 22px rgba(31, 28, 23, 0.055),
        inset 0 1px 0 rgba(255, 255, 255, 0.78);
      transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
      backdrop-filter: blur(12px);
    }

    .landing-course-button:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.9);
      box-shadow:
        0 14px 28px rgba(31, 28, 23, 0.075),
        inset 0 1px 0 rgba(255, 255, 255, 0.86);
    }

    .landing-course-button--active {
      border-color: rgba(242, 109, 45, 0.72);
      background: rgba(255, 250, 244, 0.92);
      box-shadow:
        0 12px 26px rgba(242, 109, 45, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.86);
    }

    .landing-course-button--active::after {
      content: '✓';
      position: absolute;
      right: -5px;
      top: -6px;
      display: grid;
      width: 19px;
      height: 19px;
      place-items: center;
      border-radius: 999px;
      background: #ff7138;
      color: #fffaf2;
      font-size: 11px;
      font-weight: 780;
      box-shadow: 0 7px 14px rgba(255, 113, 56, 0.22);
    }

    .landing-course-button-flag {
      font-size: 21px;
      line-height: 1;
    }

    .landing-cta-btn {
      position: relative;
      z-index: 4;
      border-color: transparent !important;
      background: #171513 !important;
      color: #fffaf2 !important;
      pointer-events: auto;
      box-shadow:
        0 16px 36px rgba(23, 21, 19, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
      transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }

    .landing-cta-btn:hover {
      opacity: 1;
      transform: translateY(-2px);
      background: #28231e !important;
      box-shadow:
        0 22px 48px rgba(23, 21, 19, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }

    .landing-alphabet-hint {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      width: 100%;
      margin: 0 0 10px;
      font-size: 14px;
      line-height: 1.15;
      color: var(--text-secondary);
      letter-spacing: -0.01em;
      text-align: left;
    }

    .landing-alphabet-hint::before {
      content: '';
      position: static;
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28);
      animation: landingHintPulse 1.4s ease-in-out infinite;
    }

    .landing-alphabet-hint strong {
      color: inherit;
      font-weight: 500;
    }

    .landing-list-arrow {
      display: inline-flex;
      margin-left: 8px;
      color: var(--accent);
      font-size: 20px;
      line-height: 1;
      animation: landingHintNudge 1.1s ease-in-out infinite;
      transform-origin: left center;
      will-change: transform, opacity;
    }

    @keyframes landingHintNudge {
      0%, 100% {
        transform: translateX(0);
        opacity: 0.65;
      }
      50% {
        transform: translateX(7px);
        opacity: 1;
      }
    }

    @keyframes landingHintPulse {
      0%, 100% {
        opacity: 0.75;
        box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.12);
      }
      50% {
        opacity: 1;
        box-shadow: 0 0 0 6px rgba(249, 115, 22, 0.02);
      }
    }

    .landing-alpha-card {
      position: relative;
      width: 100%;
      max-width: clamp(300px, 30vw, 430px);
      margin-inline: auto;
      border-radius: 28px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.46)),
        radial-gradient(circle at 92% 8%, rgba(0, 168, 132, 0.13), transparent 36%);
      padding: 12px;
      box-shadow:
        0 24px 64px rgba(31, 28, 23, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.86);
      backdrop-filter: blur(22px) saturate(1.12);
      border: 1px solid rgba(255, 255, 255, 0.26);
    }

    .landing-alpha-title {
      margin: 0 0 10px;
      padding-inline: 6px;
      color: #191817;
      font-size: 14px;
      font-weight: 760;
      letter-spacing: -0.018em;
      line-height: 1.1;
    }

    .landing-alphabet-column {
      justify-self: end;
      width: min(100%, 460px);
      align-self: center;
      padding-top: 0;
    }

    .landing-alpha-cat {
      position: absolute;
      left: clamp(-178px, -11vw, -146px);
      bottom: -18px;
      z-index: 3;
      width: clamp(162px, 12.8vw, 196px);
      height: auto;
      pointer-events: none;
      filter: drop-shadow(0 16px 26px rgba(120, 53, 15, 0.18));
    }

    .landing-learning-grid {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: clamp(14px, 2vw, 24px);
      align-items: stretch;
      padding-bottom: clamp(14px, 2vw, 22px);
    }

    .landing-screens-grid {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      gap: 16px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      overscroll-behavior-x: contain;
      padding: 0 2px 14px;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }

    .landing-screen-item {
      width: fit-content;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      border-radius: 28px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.52);
      box-shadow:
        0 18px 46px rgba(31, 28, 23, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(16px) saturate(1.08);
    }

    .landing-screen-item--crop-frame {
      width: min(78vw, 360px);
      max-height: min(50vh, 520px);
    }

    .landing-screen-media {
      width: min(84vw, 404px);
      max-width: min(84vw, 404px);
      height: auto;
      max-height: min(32vh, 258px);
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    .landing-screen-item--crop-frame .landing-screen-media {
      width: 100%;
      height: min(50vh, 520px);
      max-width: none;
      object-fit: cover;
      object-position: 64% 54%;
      transform: scale(1.2);
      transform-origin: center center;
    }

    .landing-swipe-hint {
      display: none;
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-secondary);
      letter-spacing: -0.01em;
    }

    .landing-stat-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 160px));
      gap: 14px;
    }

    .landing-cta-btn {
      width: fit-content;
      min-width: 260px;
    }

    .landing-cta-row {
      position: relative;
      z-index: 3;
      display: inline-flex;
      align-items: flex-end;
      flex-wrap: nowrap;
      gap: 0;
      margin-top: clamp(26px, 3vw, 36px) !important;
    }

    .landing-cta-cat {
      display: none;
    }

    .landing-hero-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 14px;
      color: rgba(36, 28, 20, 0.84);
      font-size: 13px;
      font-weight: 720;
      letter-spacing: -0.01em;
    }

    .landing-hero-meta span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .landing-hero-meta span::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #f59e0b;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.10);
    }

    .landing-preview-card {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
      border-radius: clamp(28px, 3.4vw, 38px);
      background: rgba(255, 255, 255, 0.62);
      padding: clamp(22px, 2.8vw, 32px);
      box-shadow:
        0 22px 60px rgba(31, 28, 23, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.80);
      backdrop-filter: blur(16px);
    }

    .landing-preview-title {
      color: #171513;
      font-size: clamp(22px, 2.2vw, 30px);
      font-weight: 820;
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .landing-preview-title--receipt {
      max-width: 420px;
      color: #2f2b26;
      font-size: clamp(19px, 1.7vw, 24px);
      font-weight: 720;
      letter-spacing: -0.032em;
      line-height: 1.08;
    }

    .landing-bill-frame {
      width: 100%;
      max-width: 430px;
      margin-top: clamp(18px, 2.2vw, 26px);
      cursor: pointer;
      perspective: 1200px;
      outline: none;
    }

    .landing-bill-flip {
      position: relative;
      transform-style: preserve-3d;
      transition: transform 520ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    .landing-bill-frame--flipped .landing-bill-flip {
      transform: rotateY(180deg);
    }

    .landing-bill-frame:focus-visible .landing-bill,
    .landing-bill-frame:hover .landing-bill {
      box-shadow:
        0 0 0 3px rgba(249, 115, 22, 0.12),
        0 22px 54px rgba(31, 28, 23, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.88);
    }

    .landing-bill {
      position: relative;
      overflow: hidden;
      width: 100%;
      min-height: 336px;
      border-radius: 18px;
      background:
        repeating-linear-gradient(0deg, rgba(23, 21, 19, 0.018) 0 1px, transparent 1px 18px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 250, 244, 0.88));
      padding: 22px clamp(16px, 2vw, 22px);
      color: #171513;
      font-variant-numeric: tabular-nums;
      box-shadow:
        0 18px 44px rgba(31, 28, 23, 0.10),
        inset 0 1px 0 rgba(255, 255, 255, 0.88);
      backface-visibility: hidden;
      transform: rotateY(0deg);
      transition: box-shadow 180ms ease, transform 180ms ease;
    }

    .landing-bill-face--back {
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(0deg, rgba(23, 21, 19, 0.016) 0 1px, transparent 1px 18px),
        linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(239, 250, 246, 0.88));
      transform: rotateY(180deg);
    }

    .landing-bill-hint {
      margin-top: 10px;
      color: rgba(62, 55, 47, 0.48);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-align: center;
    }

    .landing-bill-edge {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background:
        radial-gradient(circle at 6px -1px, transparent 7px, rgba(255, 255, 255, 0.95) 7.5px) 0 0 / 16px 8px repeat-x;
    }

    .landing-bill-edge--bottom {
      top: auto;
      bottom: 0;
      transform: rotate(180deg);
    }

    .landing-bill-top,
    .landing-bill-meta,
    .landing-bill-line,
    .landing-bill-total,
    .landing-bill-payment {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    .landing-bill-top {
      padding-bottom: 8px;
      color: #171513;
      font-size: 16px;
      font-weight: 760;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }

    .landing-bill-top span {
      color: rgba(62, 55, 47, 0.56);
      font-size: 12px;
      font-weight: 660;
      letter-spacing: 0.04em;
    }

    .landing-bill-meta {
      border-top: 1px dashed rgba(31, 28, 23, 0.18);
      border-bottom: 1px dashed rgba(31, 28, 23, 0.18);
      padding: 10px 0;
      color: rgba(62, 55, 47, 0.58);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .landing-bill-lines {
      display: grid;
      gap: 11px;
      padding: 16px 0;
    }

    .landing-bill-line {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: 10px;
      font-size: clamp(16px, 1.45vw, 19px);
      font-weight: 680;
      letter-spacing: -0.025em;
    }

    .landing-bill-qty {
      color: rgba(62, 55, 47, 0.46);
      font-size: 12px;
      font-weight: 640;
      line-height: 1.45;
    }

    .landing-bill-line strong {
      display: block;
    }

    .landing-bill-summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px 14px;
      border-top: 1px dashed rgba(31, 28, 23, 0.18);
      padding: 12px 0;
      color: rgba(62, 55, 47, 0.62);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.012em;
    }

    .landing-bill-total {
      border-top: 2px solid rgba(31, 28, 23, 0.14);
      padding-top: 13px;
      font-size: clamp(18px, 1.8vw, 24px);
      font-weight: 820;
      letter-spacing: -0.03em;
    }

    .landing-bill-payment {
      margin-top: 14px;
      border-radius: 14px;
      background: rgba(23, 21, 19, 0.055);
      padding: 9px 11px;
      color: rgba(62, 55, 47, 0.66);
      font-size: 12px;
      font-weight: 620;
      letter-spacing: 0.02em;
    }

    .landing-reasons-section {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 16px clamp(14px, 2vw, 22px);
    }

    .landing-reasons-card {
      height: 100%;
      border-radius: clamp(28px, 3.4vw, 38px);
      background:
        radial-gradient(circle at 8% 0%, rgba(255, 240, 229, 0.86), transparent 36%),
        radial-gradient(circle at 92% 12%, rgba(234, 247, 241, 0.82), transparent 34%),
        rgba(255, 255, 255, 0.66);
      padding: clamp(22px, 2.8vw, 32px);
      box-shadow:
        0 22px 60px rgba(31, 28, 23, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.80);
      backdrop-filter: blur(16px);
    }

    .landing-reasons-kicker {
      width: fit-content;
      margin-bottom: 14px;
      border-radius: 999px;
      background: rgba(25, 24, 23, 0.08);
      padding: 7px 12px;
      color: #706c67;
      font-size: 12px;
      font-weight: 620;
      letter-spacing: -0.01em;
      line-height: 1;
    }

    .landing-reasons-subtitle {
      max-width: 720px;
      margin-top: 12px;
      color: #706c67;
      font-size: clamp(15px, 1.35vw, 18px);
      font-weight: 520;
      letter-spacing: -0.016em;
      line-height: 1.38;
      text-wrap: balance;
    }

    .landing-reasons-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      margin-top: clamp(22px, 2.6vw, 30px);
    }

    .landing-reason {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 12px;
      align-items: start;
      min-height: 0;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.52);
      padding: 14px;
      border-left: 0;
    }

    .landing-reason:first-child {
      padding-left: 14px;
    }

    .landing-reason-index {
      display: grid;
      width: 58px;
      height: 58px;
      place-items: center;
      border-radius: 999px;
      background: linear-gradient(145deg, rgba(255, 240, 229, 0.96), rgba(234, 247, 241, 0.76));
      color: #ff7138;
      font-size: 25px;
      font-weight: 760;
      box-shadow:
        0 10px 24px rgba(31, 28, 23, 0.055),
        inset 0 1px 0 rgba(255, 255, 255, 0.86);
    }

    .landing-reason:nth-child(2) .landing-reason-index {
      color: #3a9e8f;
      background: rgba(234, 247, 241, 0.92);
    }

    .landing-reason-copy {
      display: grid;
      gap: 8px;
      min-width: 0;
    }

    .landing-reason-title {
      color: #191817;
      font-size: clamp(15px, 1.25vw, 18px);
      font-weight: 720;
      letter-spacing: -0.025em;
      line-height: 1.05;
    }

    .landing-reason-text {
      color: #706c67;
      font-size: clamp(13px, 1.05vw, 15px);
      font-weight: 520;
      letter-spacing: -0.012em;
      line-height: 1.38;
    }

    .landing-feature-strip {
      position: relative;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: clamp(9px, 1.2vw, 14px);
      align-items: stretch;
      justify-content: start;
      overflow: visible;
      padding-bottom: 0;
      scrollbar-width: none;
    }

    .landing-feature-strip::before {
      content: '';
      position: absolute;
      left: clamp(20px, 2vw, 30px);
      right: clamp(20px, 2vw, 30px);
      top: 50%;
      height: 1px;
      background: rgba(255, 138, 61, 0.10);
      transform: translateY(-50%);
      z-index: 0;
      pointer-events: none;
    }

    .landing-feature-strip::-webkit-scrollbar {
      display: none;
    }

    .landing-feature {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 14px;
      align-content: space-between;
      min-height: 112px;
      border-radius: 24px;
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.42)),
        radial-gradient(circle at 100% 0%, rgba(0, 168, 132, 0.10), transparent 44%);
      padding: clamp(14px, 1.6vw, 18px);
      box-shadow:
        0 14px 34px rgba(31, 28, 23, 0.055),
        inset 0 1px 0 rgba(255, 255, 255, 0.82);
      transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
    }

    .landing-feature:hover {
      transform: translateY(-2px);
      background:
        linear-gradient(145deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.52)),
        radial-gradient(circle at 100% 0%, rgba(255, 138, 61, 0.14), transparent 46%);
      box-shadow:
        0 20px 44px rgba(31, 28, 23, 0.085),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .landing-feature:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -12px;
      top: 50%;
      width: 24px;
      height: 1px;
      background: rgba(255, 138, 61, 0.16);
      transform: translateY(-50%);
      pointer-events: none;
    }

    .landing-feature:not(:last-child)::before {
      content: '';
      position: absolute;
      right: -10px;
      top: 50%;
      width: 7px;
      height: 7px;
      border-top: 1px solid rgba(255, 138, 61, 0.18);
      border-right: 1px solid rgba(255, 138, 61, 0.18);
      transform: translateY(-50%) rotate(45deg);
      pointer-events: none;
    }

    .landing-feature-icon {
      display: grid;
      width: 40px;
      height: 40px;
      place-items: center;
      border-radius: 16px;
      background:
        linear-gradient(145deg, rgba(255, 238, 218, 0.92), rgba(229, 248, 241, 0.72));
      color: #de672d;
      font-size: 17px;
      font-weight: 820;
      letter-spacing: -0.04em;
    }

    .landing-feature-title {
      display: block;
      color: #171513;
      font-size: clamp(16px, 1.35vw, 19px);
      font-weight: 780;
      letter-spacing: -0.035em;
      line-height: 1.02;
    }

    .landing-feature-copy {
      display: block;
      margin-top: 6px;
      color: rgba(62, 55, 47, 0.62);
      font-size: clamp(11px, 0.9vw, 13px);
      font-weight: 590;
      letter-spacing: -0.014em;
      line-height: 1.28;
      text-wrap: balance;
    }

    .landing-info-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: clamp(16px, 1.8vw, 22px);
    }

    .landing-info-kicker {
      display: inline-flex;
      width: fit-content;
      margin-bottom: 9px;
      border-radius: 999px;
      background: rgba(255, 238, 218, 0.72);
      padding: 7px 12px;
      color: #a24f1f;
      font-size: 12px;
      font-weight: 760;
      letter-spacing: -0.015em;
    }

    .landing-info-lead {
      max-width: 360px;
      color: rgba(62, 55, 47, 0.68);
      font-size: clamp(13px, 1.05vw, 15px);
      font-weight: 600;
      letter-spacing: -0.014em;
      line-height: 1.36;
      text-wrap: balance;
    }

    .landing-final-cta {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: clamp(16px, 2.8vw, 34px);
      background:
        linear-gradient(90deg, rgba(255, 238, 218, 0.76), rgba(255, 255, 255, 0.66));
    }

    .landing-final-cat {
      width: clamp(90px, 10vw, 142px);
      height: auto;
      align-self: end;
      margin-bottom: -32px;
      filter: drop-shadow(0 14px 24px rgba(120, 53, 15, 0.13));
    }

    .landing-info-section {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: clamp(4px, 0.8vw, 10px) 16px clamp(36px, 5vw, 64px);
    }

    .landing-info-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: clamp(14px, 2.4vw, 26px);
      max-width: 1160px;
      margin-inline: auto;
    }

    .landing-info-card,
    .landing-footer {
      border-radius: clamp(26px, 3.8vw, 38px);
      background:
        radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.92), transparent 38%),
        rgba(255, 255, 255, 0.58);
      box-shadow:
        0 22px 62px rgba(31, 28, 23, 0.09),
        inset 0 1px 0 rgba(255, 255, 255, 0.78);
      backdrop-filter: blur(16px);
    }

    .landing-info-card {
      position: relative;
      overflow: hidden;
      padding: clamp(20px, 3.4vw, 34px);
      animation: landingSectionIn 420ms ease both;
      animation-timeline: view();
      animation-range: entry 0% cover 28%;
    }

    @keyframes landingSectionIn {
      from {
        opacity: 0.72;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .landing-info-copy {
      margin-top: 14px;
      color: var(--text-secondary);
      font-size: clamp(14px, 1.55vw, 17px);
      line-height: 1.48;
      letter-spacing: -0.012em;
      text-wrap: balance;
    }

    .landing-footer-wrap {
      width: 100%;
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 16px 22px;
    }

    .landing-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      padding: 0 8px;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: -0.01em;
      background: transparent !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
    }

    .landing-footer-brand {
      display: flex;
      align-items: center;
      gap: 20px;
      max-width: none;
    }

    .landing-footer-logo {
      color: var(--text-primary);
      font-size: 22px;
      font-weight: 820;
      letter-spacing: -0.06em;
      line-height: 1;
    }

    .landing-footer-title {
      margin-bottom: 8px;
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 820;
      letter-spacing: -0.015em;
    }

    .landing-footer-links {
      display: flex;
      align-items: center;
      gap: clamp(16px, 3vw, 42px);
    }

    .landing-footer a {
      width: fit-content;
      color: inherit;
      transition: color 160ms ease;
    }

    .landing-footer a:hover {
      color: var(--text-primary);
    }

    @media (min-width: 768px) {
      .landing-hero-grid {
        gap: clamp(28px, 4vw, 52px);
        grid-template-columns: minmax(0, 1.05fr) minmax(290px, 0.95fr);
      }
    }

    @media (min-width: 1024px) {
      .landing-hero-grid {
        gap: clamp(34px, 4vw, 58px);
        grid-template-columns: minmax(0, 1.02fr) minmax(330px, 0.98fr);
      }

    }

    @media (max-width: 1023px) {
      .landing-learning-grid {
        grid-template-columns: 1fr;
      }

      .landing-feature-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .landing-feature:not(:last-child)::after {
        width: 1px;
        height: 20px;
        left: 50%;
        right: auto;
        top: calc(100% + 8px);
        transform: translateX(-50%);
      }

      .landing-feature:not(:last-child)::before {
        width: 8px;
        height: 8px;
        left: 50%;
        right: auto;
        top: calc(100% + 28px);
        border-top: 0;
        border-right: 0;
        border-left: 1px solid rgba(255, 138, 61, 0.18);
        border-bottom: 1px solid rgba(255, 138, 61, 0.18);
        transform: translateX(-50%) rotate(-45deg);
      }

      .landing-info-header {
        align-items: start;
        flex-direction: column;
      }
    }

    @media (max-width: 640px) {
      .landing-feature-strip {
        grid-template-columns: 1fr;
      }
    }

    @media (min-width: 1280px) {
      .landing-hero-grid {
        gap: clamp(44px, 4.5vw, 76px);
        grid-template-columns: minmax(0, 0.98fr) minmax(390px, 500px);
      }

      .landing-screens-grid {
        grid-auto-columns: max-content;
      }

    }

    @media (min-width: 1024px) and (max-width: 1180px) {
      .landing-alpha-cat {
        display: none;
      }

      .landing-feature-strip {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (min-width: 1440px) {
      .landing-info-grid {
        max-width: min(100%, 1180px);
      }

    }

    @media (min-width: 1600px) {
      .landing-hero-grid {
        gap: clamp(56px, 4.4vw, 88px);
        grid-template-columns: minmax(0, 1fr) minmax(440px, 560px);
      }

      .landing-alpha-card {
        max-width: 540px;
      }
    }

    @media (max-width: 767px) {
      .landing-hero-grid {
        justify-items: center;
        gap: 18px;
        min-height: 0;
      }

      .landing-copy {
        max-width: 720px;
        padding-top: 0;
      }

      .landing-alphabet-hint {
        max-width: 100%;
        font-size: 15px;
        color: color-mix(in srgb, var(--text-primary) 72%, white 28%);
      }

      .landing-alpha-card {
        max-width: min(100%, 460px);
      }

      .landing-alpha-cat {
        right: 8px;
        bottom: -66px;
      }

      .landing-screens-grid {
        grid-auto-columns: max-content;
      }
    }

    @media (max-width: 767px) {
      .landing-shell {
        overflow-x: hidden;
      }

      .landing-copy {
        max-width: 100%;
        text-align: center;
      }

      .landing-topbar {
        margin-bottom: 26px;
      }

      .landing-course-buttons {
        justify-content: center;
        margin-inline: auto;
      }

      .landing-alphabet-hint {
        max-width: min(100%, 360px);
        justify-content: center;
        padding: 10px 14px;
        border-radius: 18px;
        background: transparent;
        box-shadow: none;
        font-size: 14px;
        line-height: 1.4;
      }

      .landing-alpha-card {
        max-width: min(100%, 330px);
        padding: 8px;
        border-radius: 24px;
      }

      .landing-alpha-cat {
        display: none;
      }

      .landing-stat-grid {
        grid-template-columns: 1fr;
      }

      .landing-cta-btn {
        width: min(100%, 320px);
        min-width: 0;
      }

      .landing-cta-row {
        display: flex;
        width: fit-content;
        max-width: 100%;
        margin-inline: auto;
        justify-content: center;
        align-items: flex-end;
        flex-wrap: nowrap;
        gap: 0;
      }

      .landing-cta-cat {
        width: 116px !important;
        margin-right: -2px;
        transform: translateY(16px);
      }

      .landing-screens-grid {
        grid-auto-columns: max-content;
        gap: 8px;
        padding-bottom: 4px;
        overflow-x: auto;
        overflow-y: hidden;
        padding-inline: 6px;
        scrollbar-width: none;
        scroll-padding-inline: 6px;
        scroll-snap-type: x proximity;
      }

      .landing-screens-grid::-webkit-scrollbar {
        display: none;
      }

      .landing-screen-item {
        width: min(78vw, 296px);
        aspect-ratio: 296 / 214;
        border-color: rgba(148, 163, 184, 0.22);
        background: rgba(255, 255, 255, 0.6);
        box-shadow: none;
      }

      .landing-screen-media {
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: none;
        object-fit: cover;
        object-position: top center;
      }

      .landing-screen-item {
        scroll-snap-align: center;
      }

      .landing-screen-item--crop-frame {
        width: min(78vw, 286px);
        aspect-ratio: 286 / 360;
        max-height: none;
      }

      .landing-screen-item--crop-frame .landing-screen-media {
        width: 100%;
        height: 100%;
      }

      .landing-screen-media--contain-mobile {
        object-fit: contain;
        object-position: center top;
      }

      .landing-swipe-hint {
        display: block;
        margin-top: 8px;
      }

      .landing-screen-item:nth-child(n + 5) {
        display: none;
      }

      .landing-info-section {
        padding-top: 2px;
        padding-bottom: 34px;
      }

      .landing-info-grid {
        grid-template-columns: 1fr;
      }

      .landing-learning-grid {
        grid-template-columns: 1fr;
      }

      .landing-feature-strip {
        grid-template-columns: 1fr;
      }

      .landing-reasons-list {
        grid-template-columns: 1fr;
        gap: 18px;
      }

      .landing-reason,
      .landing-reason:first-child {
        border-left: 0;
        padding: 14px;
      }

      .landing-final-cta {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .landing-final-cat {
        display: none;
      }

      .landing-footer {
        flex-direction: column;
        align-items: flex-start;
      }

      .landing-footer-brand,
      .landing-footer-links {
        flex-wrap: wrap;
      }

      .landing-screens-grid {
        margin-top: 20px;
      }
    }

    @media (max-width: 479px) {
      .landing-hero-grid {
        gap: 14px;
      }

      .landing-alphabet-hint {
        font-size: 12px;
        line-height: 1.45;
      }

      .landing-alpha-card {
        max-width: min(100%, 342px);
      }

      .landing-course-buttons {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 767px) {
      .landing-subtitle {
        max-width: 360px;
      }
    }

    @media (max-width: 479px) {
      .landing-subtitle {
        max-width: 320px;
      }
    }

    @media (min-width: 900px) {
      .landing-subtitle {
        white-space: nowrap;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .landing-bill-flip {
        transition: none;
      }
    }

    @media (display-mode: standalone) and (max-width: 767px) {
      .landing-screens-grid {
        grid-auto-columns: 296px;
        scroll-snap-type: none;
        scroll-padding-inline: 0;
      }

      .landing-screen-item {
        width: 296px;
      }

      .landing-screen-item--crop-frame {
        width: 286px;
      }
    }

    @media (max-width: 767px) {
      html[data-standalone='true'] .landing-screens-grid {
        grid-auto-columns: 296px;
        scroll-snap-type: none;
        scroll-padding-inline: 0;
      }

      html[data-standalone='true'] .landing-screen-item {
        width: 296px;
      }

      html[data-standalone='true'] .landing-screen-item--crop-frame {
        width: 286px;
      }
    }
  `;

  return (
    <main className="landing-shell min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <style dangerouslySetInnerHTML={{ __html: landingStyles }} />
      <section id="languages" className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-9">
        <div className="landing-topbar">
          <div className="landing-brand">Deda</div>
          <AuthStatus />
        </div>
        <div className="landing-hero-grid grid grid-cols-1 md:grid-cols-[minmax(0,1.08fr)_minmax(250px,0.92fr)]">
          <div className="landing-copy max-w-none md:col-start-1 md:row-start-1">
            <h1 className="landing-title max-w-[620px] text-[clamp(42px,5.7vw,74px)] font-semibold leading-[0.98] tracking-[-0.02em]">
              <LandingCourseTitle />
            </h1>
            <p className="landing-subtitle mt-6 text-[clamp(18px,1.8vw,22px)] leading-[1.42] text-[var(--text-secondary)]">
              Слушай буквы, читай слова, закрепляй в игре.
            </p>
            <div className="landing-course-label">Какой язык будем учить?</div>
            <LandingLanguagePicker />
            <div className="landing-cta-row mt-3">
              <Link
                href="/lessons"
                className="landing-cta-btn inline-flex h-[64px] items-center justify-center rounded-[20px] border border-[var(--accent)] bg-[var(--accent)] px-7 text-[20px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Начать первый урок <span className="ml-3 text-[26px] leading-none">→</span>
              </Link>
            </div>
            <div className="landing-hero-meta" aria-label="Условия старта">
              <span>Бесплатно</span>
              <span>Займёт около 5 минут</span>
            </div>
          </div>

          <div className="landing-alphabet-column relative mt-8 w-full max-w-[430px] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 lg:max-w-[470px]">
            <Image
              src="/images/cats/deda-reading-clean.png"
              alt=""
              width={180}
              height={180}
              priority
              className="landing-alpha-cat"
            />
            <div className="flex flex-col items-start">
              <div className="landing-alpha-card min-w-0 self-center">
                <div className="landing-alpha-title">
                  <LandingAlphabetTitle />
                </div>
                <div className="landing-alphabet-hint">
                  <span>
                    Нажми на букву и послушай, как она звучит
                  </span>
                </div>
                <LandingAlphabet />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-learning-grid">
          <div className="landing-preview-card">
            <h2 className="landing-preview-title landing-preview-title--receipt">Скоро ты сможешь прочитать счёт и легко разделить его с друзьями — без переводчика.</h2>
            <LandingRestaurantBill />
          </div>

          <LandingReadingReasons />
        </div>
      </section>

      <section className="landing-info-section" aria-label="Что внутри Deda">
        <div className="landing-info-grid">
          <div className="landing-info-card">
            <div className="landing-info-header">
              <div>
                <span className="landing-info-kicker">Внутри Deda</span>
                <h2 className="landing-preview-title">От первой буквы до первых фраз</h2>
              </div>
              <p className="landing-info-lead">
                Слушай, читай, закрепляй и начинай говорить.
              </p>
            </div>
            <div className="landing-feature-strip">
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">1</span>
                <span><span className="landing-feature-title">Слушай</span><span className="landing-feature-copy">Нажми и услышь звук буквы.</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">2</span>
                <span><span className="landing-feature-title">Читай</span><span className="landing-feature-copy">Сразу читай знакомые слова.</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">3</span>
                <span><span className="landing-feature-title">Играй</span><span className="landing-feature-copy">Понял слово — сделал ход.</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">4</span>
                <span><span className="landing-feature-title">Говори</span><span className="landing-feature-copy">Фразы, которые пригодятся сразу.</span></span>
              </div>
              <div className="landing-feature">
                <span className="landing-feature-icon" aria-hidden="true">✓</span>
                <span><span className="landing-feature-title">Расти</span><span className="landing-feature-copy">Очки, серии и новые уровни.</span></span>
              </div>
            </div>
          </div>
          <div className="landing-info-card landing-final-cta">
            <Image
              src="/images/cats/deda-landing-curious.png"
              alt=""
              width={140}
              height={140}
              className="landing-final-cat"
            />
            <div>
              <h2 className="landing-preview-title"><LandingFinalCtaTitle /></h2>
              <p className="landing-info-copy mt-2">
                Первый урок займёт несколько минут.
              </p>
            </div>
            <Link href="/lessons" className="landing-cta-btn inline-flex h-[58px] items-center justify-center rounded-[18px] px-7 text-[18px] font-semibold">
              Начать первый урок <span className="ml-3 text-[24px] leading-none">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer-wrap" aria-label="Информация о Deda">
        <div className="landing-footer">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">Deda</div>
            <p>© 2026 Deda. Учимся читать играя.</p>
          </div>
          <div className="landing-footer-links">
            <a href="#languages">Языки</a>
            <Link href="/support">Поддержка</Link>
            <Link href="/privacy">Конфиденциальность</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
