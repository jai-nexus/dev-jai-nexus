
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewButtons({ syncRunId }: { syncRunId: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onClick(action: "apply" | "reject") {
        if (!confirm(`Confirm ${action}?`)) return;
        setLoading(true);
        try {
            // NOTE: In a real app we'd need a proxy to inject the internal token or use session auth.
            // For this v0, we might hit 401 if calling from browser. 
            // I will assume for now I can call it.
            const res = await fetch(`/api/internal/agents/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ syncRunId }),
            });
            if (res.ok) {
                alert(`${action} succeeded`);
                router.refresh();
                router.push("/operator/sync-runs");
            } else {
                const json = await res.json();
                alert(`Failed: ${json.error}`);
            }
        } catch {
            alert("Error calling API");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-4 mt-6">
            <button
                onClick={() => onClick("apply")}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? "..." : "✅ Approve & Apply"}
            </button>
            <button
                onClick={() => onClick("reject")}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? "..." : "❌ Reject"}
            </button>
        </div>
    );
}
