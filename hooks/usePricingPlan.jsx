// hooks/usePricingPlans.js
import { useEffect, useState } from "react";

const MANIFEST_URL =
  "https://plans.infinitepackages.com/plans/manifest.json";

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed API: ${url}`);
  }
  return res.json();
}

export function usePricingPlan() {
  const [plans, setPlans] = useState([]);
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch manifest
        const manifestData = await fetchJson(MANIFEST_URL);
        if (cancelled) return;

        console.log("📦 Manifest:", manifestData);
        setManifest(manifestData);

        const latest = manifestData?.latest;
        if (!latest) throw new Error("manifest.latest missing");

        // 2️⃣ Fetch plans
        const plansUrl = `https://plans.infinitepackages.com/plans/subscriptions/${encodeURIComponent(
          latest
        )}/allplans.json`;

        console.log("➡️ Plans URL:", plansUrl);

        const plansData = await fetchJson(plansUrl);
        if (cancelled) return;

        console.log("💰 Raw Plans Object:", plansData);

        // 3️⃣ Convert object → array + sort
        const plansArray = Object.values(plansData)
        //   .filter((p) => p.IsActive)
          .sort((a, b) => a.SortOrder - b.SortOrder);

        console.log("✅ Parsed Plans Array:", plansArray);

        setPlans(plansArray);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    plans,
    manifest,
    loading,
    error,
  };
}
