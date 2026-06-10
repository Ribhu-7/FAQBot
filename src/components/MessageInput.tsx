import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const MAX_CHARS = 500;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const charCount = text.length;

  return (
    <form onSubmit={handleSend} className="p-md bg-surface-container-lowest border-t border-outline-variant">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          disabled={isLoading}
          placeholder={isLoading ? "FAQBot is typing..." : "Ask a question..."}
          className="w-full bg-surface-container-low border border-outline-variant rounded-full py-sm px-md pr-12 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-body-sm text-[14px] text-on-surface transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="absolute right-2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:scale-100"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </div>
      <div className="mt-xs flex items-center justify-between px-md">
        {charCount > MAX_CHARS - 50 ? (
          <span className="text-[10px] text-error font-medium">
            {charCount}/{MAX_CHARS} characters
          </span>
        ) : (
          <span />
        )}
        <span className="text-[10px] text-outline uppercase tracking-widest font-bold text-center w-full block">
          Powered by FAQBot AI
        </span>
      </div>
    </form>
  );
};
