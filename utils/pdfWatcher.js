// 🔥 PDF WATCHER UTILITY
// Simple cache busting for React Native

let refreshCounter = 0;
let cachedTemplate = null;

// Force refresh by incrementing counter and clearing cache
export const forceRefreshTemplate = () => {
  refreshCounter++;
  cachedTemplate = null; // Clear the cache
  console.log('🔄 Template refresh forced, counter:', refreshCounter);
};

// Get template with cache busting
export const getTemplateWithCacheBust = () => {
  console.log('🔄 Loading template, refresh counter:', refreshCounter);
  
  // In React Native, Metro bundler aggressively caches modules
  // The only way to get fresh content is to reload the app or use Fast Refresh
  // For development, just return the template - Fast Refresh will update it
  const { TemplateJourneyRouters } = require('../components/pdf/winterFellPdf');
  
  console.log('✅ Template loaded, counter:', refreshCounter);
  return TemplateJourneyRouters;
};

// Get current refresh counter
export const getRefreshCounter = () => refreshCounter;
