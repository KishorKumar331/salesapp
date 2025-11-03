// storage/quotationDrafts.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (tripId) => `quotationDraft:${tripId}`;

/** Save draft data locally */
export async function saveQuotationDraft(tripId, data) {
  try {
    const storageKey = key(tripId);
    const payload = JSON.stringify({ v: 1, updatedAt: Date.now(), data });
    console.log(`💾 Saving draft with key: ${storageKey}`);
    await AsyncStorage.setItem(storageKey, payload);
  } catch (e) {
    console.warn('Failed to save draft', e);
  }
}

/** Load saved draft (if any) */
export async function loadQuotationDraft(tripId) {
  try {
    const storageKey = key(tripId);
    const raw = await AsyncStorage.getItem(storageKey);
    console.log(`📖 Loading draft with key: ${storageKey}, found: ${!!raw}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data;
  } catch (e) {
    console.warn('Failed to load draft', e);
    return null;
  }
}

/** Clear a trip's draft */
export async function clearQuotationDraft(tripId) {
  try {
    const storageKey = key(tripId);
    console.log(`🗑️ Clearing draft with key: ${storageKey}`);
    await AsyncStorage.removeItem(storageKey);
  } catch (e) {
    console.warn('Failed to clear draft', e);
  }
}

/** Debug function to list all stored drafts */
export async function listAllDrafts() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const draftKeys = keys.filter(k => k.startsWith('quotationDraft:'));
    console.log(`📋 Found ${draftKeys.length} stored drafts:`, draftKeys);
    return draftKeys;
  } catch (e) {
    console.warn('Failed to list drafts', e);
    return [];
  }
}
