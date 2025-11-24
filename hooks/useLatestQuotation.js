import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

const useLatestQuotation = (tripId) => {
  const [latestQuotation, setLatestQuotation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestQuotation = useCallback(async () => {
    if (!tripId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/lead-managment/quotations?TripId=${tripId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const sorted = [...data].sort((a, b) => 
          new Date(b.createdAt || b.CreatedAt || b.date || b.Date || 0) - 
          new Date(a.createdAt || a.CreatedAt || a.date || a.Date || 0)
        );
        const latest = sorted[0];
        setLatestQuotation(latest);
        return latest;           // ✅ IMPORTANT: return karo
      } else {
        setLatestQuotation(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching latest quotation:', err);
      setError(err.message || 'Failed to fetch quotation');
      Alert.alert('Error', 'Failed to fetch latest quotation');
      return null;               // ✅ error case me bhi null return
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchLatestQuotation();
  }, [fetchLatestQuotation]);

  const refreshQuotation = useCallback(() => {
    return fetchLatestQuotation();   // ✅ ab ye Promise<quotation> return karega
  }, [fetchLatestQuotation]);

  return { 
    latestQuotation, 
    loading, 
    error, 
    refreshQuotation 
  };
};

export default useLatestQuotation;
