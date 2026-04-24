"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

const CONTENT_BASE_WIDTH = 800; // AbcViewer 기준 너비

interface ScaledContentProps {
  children: ReactNode;
  baseWidth?: number; // 기준 너비 외부에서 주입 가능
}

export default function ScaledContent({
  children,
  baseWidth = CONTENT_BASE_WIDTH,
}: ScaledContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        setScale(containerWidth / baseWidth);
      }
    });

    const contentObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height);
      }
    });

    containerObserver.observe(container);
    contentObserver.observe(content);

    return () => {
      containerObserver.disconnect();
      contentObserver.disconnect();
    };
  }, [baseWidth]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: contentHeight * scale }}
    >
      <div
        ref={contentRef}
        style={{
          width: baseWidth,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}