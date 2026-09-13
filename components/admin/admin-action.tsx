"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminAction({
  action,
  id,
  decision,
  status,
  label,
}: {
  action: string;
  id?: string;
  decision?: "APPROVE" | "REJECT";
  status?: string;
  label: string;
}) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant={decision === "REJECT" ? "ghost" : "default"}
      onClick={async () => {
        const res = await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, id, decision, status }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) toast.error(data.error ?? "Action failed");
        else {
          toast.success("Updated");
          router.refresh();
        }
      }}
    >
      {label}
    </Button>
  );
}
