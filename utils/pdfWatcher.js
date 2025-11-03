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
  
  // Clear require cache to force fresh import
  const modulePath = '../components/pdf/winterFellPdf';
  const resolvedPath = require.resolve(modulePath);
  
  // Delete from cache
  if (require.cache[resolvedPath]) {
    delete require.cache[resolvedPath];
    console.log('🗑️ Cleared cache for:', resolvedPath);
  }
  
  // Fresh import
  const { TemplateJourneyRouters } = require(modulePath);
  console.log('✅ Template loaded fresh');
  return TemplateJourneyRouters;
};

// Get current refresh counter
export const getRefreshCounter = () => refreshCounter;
