"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function AdminSettings({ settings }: { settings: { key: string; value: string }[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(settings);

  return (
    <div className="space-y-3 p-3">
      {rows.map((row, idx) => (
        <div key={row.key} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
          <span className="text-sm">{row.key}</span>
          <Input
            value={row.value}
            onChange={(e) =>
              setRows((current) => current.map((item, i) => (i === idx ? { ...item, value: e.target.value } : item)))
            }
          />
          <Button
            size="sm"
            onClick={async () => {
              const res = await fetch("/api/admin/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "UPDATE_SETTING", key: row.key, value: row.value }),
              });
              const data = await res.json();
              if (!data.ok) toast.error(data.error ?? "Save failed");
              else {
                toast.success("Saved");
                router.refresh();
              }
            }}
          >
            Save
          </Button>
        </div>
      ))}
    </div>
  );
}
