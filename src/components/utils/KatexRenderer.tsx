'use client';

import React from 'react';
import katex from 'katex';

interface KatexProps {
  math: string;
  block?: boolean;
  className?: string;
}

export function Katex({ math, block = false, className = '' }: KatexProps) {
  if (!math) return null;
  try {
    const html = katex.renderToString(math, {
      displayMode: block,
      throwOnError: false,
    });
    return (
      <span
        className={block ? `block my-2 ${className}` : `inline-block ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (err) {
    return <span className={className}>{math}</span>;
  }
}

/**
 * Renders text that may contain embedded LaTeX delimiters like $...$, $$...$$, \(...\), \[...\]
 */
export function RenderMathText({ content, className = '' }: { content: string; className?: string }) {
  if (!content) return null;

  const str = String(content);
  // Delimiter regex matching:
  // $$...$$ (block)
  // \[...\] (block)
  // $...$ (inline)
  // \(...\) (inline)
  const regex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g;
  const parts = str.split(regex);

  if (parts.length === 1 && !str.startsWith('$') && !str.startsWith('\\(')) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: str }} />;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const raw = part.slice(2, -2);
          return <Katex key={index} math={raw} block />;
        }
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          const raw = part.slice(2, -2);
          return <Katex key={index} math={raw} block />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const raw = part.slice(1, -1);
          return <Katex key={index} math={raw} block={false} />;
        }
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const raw = part.slice(2, -2);
          return <Katex key={index} math={raw} block={false} />;
        }
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </span>
  );
}

export default Katex;
