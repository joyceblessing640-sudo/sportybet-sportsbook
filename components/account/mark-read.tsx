"use client";

import { useAuth } from "@/components/providers";
import { toast } from "sonner";

export function MarkRead() {
  const { refresh } = useAuth();
  return (
    <button
      type="button"
      className="text-sm font-semibold text-brand"
      onClick={async () => {
        const res = await fetch("/api/notifications/read", { method: "POST" });
        const data = await res.json();
        if (!data.ok) toast.error(data.error ?? "Could not update.");
        else {
          toast.success("Marked as read");
          await refresh();
        }
      }}
    >
      Mark all read
    </button>
  );
}
