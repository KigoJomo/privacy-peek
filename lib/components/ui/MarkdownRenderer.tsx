'use client';

import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeCopyButton } from './CodeCopyButton';
import { CodeXml } from 'lucide-react';

interface MarkdownRendererProps {
  markDowncontent: string;
  className?: string;
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  markDowncontent,
  className,
}) => {
  return (
    <div className={`${className} max-w-full prose dark:prose-invert`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({
            inline,
            className,
            children,
            ...rest
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isInlineCode =
              inline || (className === undefined && !codeString.includes('\n'));

            return !isInlineCode ? (
              <div className="code-block-wrapper border border-foreground-light/10 rounded-xl my-0 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-1 bg-[#0c0c0c] border-b border-foreground-light/10">
                  <div className="flex items-center gap-2">
                    <CodeXml size={16} className="stroke-accent" />
                    <span className="text-xs text-foreground/60 mt-1">
                      {match ? match[1] : 'txt'}
                    </span>
                  </div>
                  <CodeCopyButton textToCopy={codeString} />
                </div>

                <SyntaxHighlighter
                  style={oneDark}
                  language={match ? match[1] : 'text'}
                  PreTag={'div'}
                  {...rest}>
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <span
                className={`font-mono text-sm bg-foreground-light/30 px-1.5 py-0.5 rounded whitespace-nowrap ${className}`}
                {...rest}>
                {String(children).replace(/`/g, '')}
              </span>
            );
          },

          // customizing other elements
          a: ({ ...rest }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-accent hover:text-accent/70 transition-all duration-100"
              {...rest}
            />
          ),
          table: ({ ...rest }) => (
            <div className="overflow-x-auto border border-foreground-light/10 rounded-2xl hide-scrollbar">
              <table
                className="my-custom-table-class !m-0 border-collapse w-full text-sm overflow-hidden"
                {...rest}
              />
            </div>
          ),
          tr: ({ ...rest }) => (
            <tr className="border-t border-foreground-light/10" {...rest} />
          ),
          th: ({ ...rest }) => (
            <th
              className="px-2 py-2 bg-background-light/100 font-semibold text-left"
              {...rest}
            />
          ),
          td: ({ ...rest }) => (
            <td
              className="bg-[#0c0c0c] hover:bg-background-light px-2 py-3 font-light text-sm transition-all duration-300"
              {...rest}
            />
          ),
        }}>
        {markDowncontent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;