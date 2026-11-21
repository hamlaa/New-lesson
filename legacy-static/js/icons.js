/* Inline SVG icon set (stroke icons, 24×24, inherit currentColor).
   Used by policy cards and social links. Add your own by adding a key. */
const ICONS = (() => {
  const s = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  return {
    book: s('<path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5Z"/><path d="M12 6v13.5"/>'),
    chat: s('<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9.5h8M8 12.5h5"/>'),
    leaf: s('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/>'),
    star: s('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>'),
    drop: s('<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>'),
    heart: s('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>'),
    users: s('<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.7c1.9.6 3.1 2.2 3.5 4.8"/>'),
    trophy: s('<path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5"/><path d="M12 14v3M8.5 20h7l-1-3h-5Z"/>'),
    wifi: s('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.7 15.8a5 5 0 0 1 6.6 0"/><circle cx="12" cy="19" r=".8" fill="currentColor"/>'),
    bus: s('<rect x="4" y="3.5" width="16" height="14" rx="3"/><path d="M4 11h16M8 20.5v-3M16 20.5v-3"/><circle cx="8" cy="14.5" r=".8" fill="currentColor"/><circle cx="16" cy="14.5" r=".8" fill="currentColor"/>'),
    sun: s('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'),
    calendar: s('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
    arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    arrowDown: s('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    arrowUp: s('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    plane: s('<path d="M21 3 3 10.5l7 2.5 2.5 7Z"/><path d="m21 3-11 10"/>'),
    /* social */
    instagram: s('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/>'),
    facebook: s('<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z"/>'),
    tiktok: s('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.8 2.2 4.5 5 4.8"/>'),
    line: s('<path d="M12 4c5 0 9 3.1 9 7 0 3.9-4 7-9 7l-4 3v-3.6C5 16.2 3 13.8 3 11c0-3.9 4-7 9-7Z"/><path d="M8 9.5v3.5h2M12 9.5V13M14.5 13V9.5l2.5 3.5V9.5"/>'),
    youtube: s('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3Z"/>'),
    x: s('<path d="M4 4l16 16M20 4 4 20"/>'),
  };
})();
