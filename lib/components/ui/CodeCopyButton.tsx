'use client';

import { Check, CopyIcon } from 'lucide-react';
import { FC, useState } from 'react';
import Tooltip from './Tooltip';

export const CodeCopyButton: FC<{ textToCopy: string; className?: string }> = ({
  textToCopy,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip
      content={isCopied ? 'Copied!' : 'Copy'}
      position="left"
      className="text-xs">
      <button
        onClick={handleCopy}
        className={`text-xs text-foreground/50 hover:text-foreground transition-colors p-1 rounded cursor-pointer ${className}`}
        aria-label={isCopied ? 'Copied!' : 'Copy code'}>
        {isCopied ? <Check size={14} className="" /> : <CopyIcon size={14} />}
      </button>
    </Tooltip>
  );
};