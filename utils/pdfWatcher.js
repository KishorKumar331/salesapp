// 🔥 PDF WATCHER UTILITY
// Simple cache busting for React Native

let refreshCounter = 0;

// Force refresh by incrementing counter
export const forceRefreshTemplate = () => {
  refreshCounter++;
  console.log('🔄 Template refresh forced, counter:', refreshCounter);
};

// Get template with cache busting
export const getTemplateWithCacheBust = () => {
  console.log('🔄 Loading template, refresh counter:', refreshCounter);
  
  // React Native doesn't support require.resolve()
  // Just import fresh - Metro bundler handles caching differently
  const { TemplateJourneyRouters } = require('../components/pdf/winterFellPdf');
  console.log('✅ Template loaded, counter:', refreshCounter);
  return TemplateJourneyRouters;
};

// Get current refresh counter
export const getRefreshCounter = () => refreshCounter;
