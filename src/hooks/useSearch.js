import { useMemo, useState } from "react";

export default function useSearch(items, fields = []) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;

    const q = query.toLowerCase();

    return items.filter((item) =>
      fields.some((field) =>
        String(item[field] || "").toLowerCase().includes(q)
      )
    );
  }, [query, items]);

  return { query, setQuery, filtered };
}
