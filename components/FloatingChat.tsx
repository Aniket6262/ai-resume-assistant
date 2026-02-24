"use client";

import { useState } from "react";
import ChatBox from "./ChatBox";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {open && (
        <div
          className="w-[370px] max-h-[600px] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "#0e0e0e",
            border: "1px solid #2a2a2a",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <ChatBox />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{
          width: "84px",
          height: "84px",
          background: "linear-gradient(135deg, #f472b6 0%, #818cf8 50%, #38bdf8 100%)",
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 0 28px rgba(129,140,248,0.6), 0 0 60px rgba(244,114,182,0.2)",
        }}
        aria-label="Toggle GOJO chat"
      >
        {open ? (
          // Close icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Text label
          <span style={{ fontSize: "10px", fontWeight: 600, color: "#0f172a", textAlign: "center", lineHeight: "1.2", letterSpacing: "0.01em" }}>
            GOJO<br />Aniket's AI Assistant
          </span>
        )}
      </button>
    </div>
  );
}