"use client";
import { useState, useEffect } from "react";

export function useBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch from API
  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setBoards(data);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, []);

  // Add board via API
  async function addBoard(name,owner) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ownerId: owner, // <- ganti ini dengan ID user aktif (bisa dari session)
        }),
      });

      const newBoard = await res.json();
      if (!res.ok) throw new Error(newBoard.error || "Failed to add project");
      setBoards([...boards, newBoard]);
    } catch (err) {
      console.error("Add board error:", err.message);
    }
  }

  return { boards, addBoard, loading };
}
