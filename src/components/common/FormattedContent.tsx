'use client';

import React from 'react';
import katex from 'katex';

interface FormattedContentProps {
  content?: string | null;
  className?: string;
  inline?: boolean;
}

/**
 * Safely renders LaTeX expression using KaTeX.
 * Returns HTML string with throwOnError = false to avoid crashes.
 */
function renderKatexToString(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
    });
  } catch {
    return expr;
  }
}

/**
 * Parses inline string into React nodes:
 * 1. Math formulas ($...$)
 * 2. Markdown formatting (**bold**, *italic*, `code`)
 */
function renderInlineContent(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match inline math $...$
  const mathInlineRegex = /\$([^$\n]+?)\$/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathInlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      nodes.push(...renderMarkdownInline(plainText, `text-${lastIndex}`));
    }

    const mathContent = match[1];
    const html = renderKatexToString(mathContent, false);
    nodes.push(
      <span
        key={`math-${match.index}`}
        className="katex-inline mx-0.5 select-text"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const trailingText = text.slice(lastIndex);
    nodes.push(...renderMarkdownInline(trailingText, `text-${lastIndex}`));
  }

  return nodes;
}

/**
 * Parses inline markdown: **bold**, *italic*, `code`
 */
function renderMarkdownInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, `code`
  const mdRegex = /(\*\*[\s\S]+?\*\*|\*[^*\n]+?\*|`[^`\n]+?`)/g;
  const parts = text.split(mdRegex);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={key} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={key} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={key}
          className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-300 border border-slate-700/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

type Block =
  | { type: 'p'; content: string }
  | { type: 'math_block'; content: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

/**
 * Parses multi-line raw text into blocks (paragraphs, lists, block math)
 */
function parseBlocks(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inMultiLineMath = false;
  let mathBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Multi-line block math ($$ ... $$)
    if (inMultiLineMath) {
      if (trimmed.endsWith('$$')) {
        mathBuffer.push(trimmed.slice(0, -2));
        blocks.push({ type: 'math_block', content: mathBuffer.join('\n') });
        mathBuffer = [];
        inMultiLineMath = false;
      } else {
        mathBuffer.push(line);
      }
      continue;
    }

    if (trimmed.startsWith('$$')) {
      currentList = null;
      if (trimmed.endsWith('$$') && trimmed.length > 2) {
        // Single line $$...$$
        blocks.push({ type: 'math_block', content: trimmed.slice(2, -2) });
      } else {
        inMultiLineMath = true;
        mathBuffer = [trimmed.slice(2)];
      }
      continue;
    }

    // Unordered list item (* or -)
    const ulMatch = line.match(/^(\s*)[*-]\s+(.+)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        currentList = { type: 'ul', items: [] };
        blocks.push(currentList);
      }
      currentList.items.push(ulMatch[2]);
      continue;
    }

    // Ordered list item (1. 2. etc)
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        currentList = { type: 'ol', items: [] };
        blocks.push(currentList);
      }
      currentList.items.push(olMatch[2]);
      continue;
    }

    // Non-list line resets current list accumulation
    currentList = null;

    if (trimmed === '') {
      // Empty line / paragraph break
      continue;
    }

    // Normal paragraph
    blocks.push({ type: 'p', content: line });
  }

  // If math block was unclosed, flush whatever was collected
  if (inMultiLineMath && mathBuffer.length > 0) {
    blocks.push({ type: 'math_block', content: mathBuffer.join('\n') });
  }

  return blocks;
}

export default function FormattedContent({
  content,
  className = '',
  inline = false,
}: FormattedContentProps) {
  if (!content) return null;

  // If inline mode requested or content has no newlines and no block math
  const hasBlockFeatures = content.includes('\n') || content.includes('$$');

  if (inline || !hasBlockFeatures) {
    return (
      <span className={`inline-block leading-relaxed ${className}`}>
        {renderInlineContent(content)}
      </span>
    );
  }

  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-2.5 leading-relaxed text-inherit ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'math_block') {
          const html = renderKatexToString(block.content, true);
          return (
            <div
              key={`block-${idx}`}
              className="katex-display my-2 overflow-x-auto rounded-lg bg-slate-950/40 p-2 text-center border border-slate-800/40"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={`block-${idx}`} className="list-disc list-inside space-y-1.5 pl-1 my-2">
              {block.items.map((item, itemIdx) => (
                <li key={`li-${itemIdx}`} className="leading-relaxed">
                  {renderInlineContent(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={`block-${idx}`} className="list-decimal list-inside space-y-1.5 pl-1 my-2">
              {block.items.map((item, itemIdx) => (
                <li key={`li-${itemIdx}`} className="leading-relaxed">
                  {renderInlineContent(item)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={`block-${idx}`} className="leading-relaxed">
            {renderInlineContent(block.content)}
          </p>
        );
      })}
    </div>
  );
}
