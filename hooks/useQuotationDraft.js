// hooks/useQuotationDraft.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { saveQuotationDraft, loadQuotationDraft } from '@/storage/quotationDrafts';

function useDebounced(fn, delay = 700) {
  const t = useRef(null);
  const fnRef = useRef(fn);
  
  // Update the ref when fn changes
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  
  return useCallback((...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]);
}

/**
 * Handles RHF initialization + async draft load + debounced autosave
 * @param {string} tripId - The trip ID
 * @param {object} defaults - Default form values
 * @param {boolean} skipDraftLoad - If true, skip loading cached draft (use when opening existing quotation)
 * @param {string} uniqueId - Unique identifier (like QuoteId) to track when to reset form
 */
export function useQuotationDraft(
  tripId,
  defaults,
  skipDraftLoad = false,
  uniqueId = null
) {
  const [loading, setLoading] = useState(true);
  const methods = useForm({ defaultValues: defaults, mode: 'onChange' });
  const defaultsRef = useRef(defaults);
  
  // Update ref when defaults change
  useEffect(() => {
    defaultsRef.current = defaults;
  }, [defaults]);

  useEffect(() => {
    (async () => {
      console.log(`🔄 useQuotationDraft: Loading for TripId: ${tripId}, skipDraftLoad: ${skipDraftLoad}, uniqueId: ${uniqueId}`);
      setLoading(true);
      
      if (skipDraftLoad) {
        console.log(`⏭️ useQuotationDraft: Skipping draft load, using fresh data`);
        // Reset form with fresh defaults when opening existing quotation
        methods.reset(defaultsRef.current);
        setLoading(false);
        return;
      }
      
      const saved = tripId ? await loadQuotationDraft(tripId) : null;
      if (saved) {
        console.log(`✅ useQuotationDraft: Found saved data for ${tripId}`);
        methods.reset({ ...(defaultsRef.current), ...(saved) });
      } else {
        console.log(`❌ useQuotationDraft: No saved data for ${tripId}`);
        methods.reset(defaultsRef.current);
      }
      setLoading(false);
    })();
  }, [tripId, skipDraftLoad, uniqueId]);

  const saveValues = useCallback((values) => {
    // Don't autosave when viewing existing quotations
    if (tripId && !skipDraftLoad) {
      saveQuotationDraft(tripId, values);
    }
  }, [tripId, skipDraftLoad]);

  const debounced = useDebounced(saveValues, 700);

  useEffect(() => {
    // Only watch for changes if we should be autosaving
    if (skipDraftLoad) return;
    
    const sub = methods.watch((vals) => debounced(vals));
    return () => sub.unsubscribe();
  }, [methods.watch, debounced, skipDraftLoad]);

  return { methods, loading };
}
