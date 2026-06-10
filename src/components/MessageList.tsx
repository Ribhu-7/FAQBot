import React, { useEffect, useRef } from 'react';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  matched?: boolean;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSelectChip: (question: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onSelectChip }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // A basic helper to render answer with markdown bullet points
  const renderMessageContent = (text: string) => {
    if (!text.includes('* ')) {
      return <p className="font-body-sm text-[14px] text-on-surface leading-relaxed whitespace-pre-line">{text}</p>;
    }

    const parts = text.split('\n');
    const introLines: string[] = [];
    const listItems: string[] = [];

    parts.forEach(line => {
      if (line.trim().startsWith('* ')) {
        listItems.push(line.trim().substring(2));
      } else {
        introLines.push(line);
      }
    });

    return (
      <div className="space-y-sm">
        {introLines.length > 0 && (
          <p className="font-body-sm text-[14px] text-on-surface leading-relaxed whitespace-pre-line">
            {introLines.join('\n')}
          </p>
        )}
        {listItems.length > 0 && (
          <ul className="space-y-xs">
            {listItems.map((item, idx) => {
              // Extract bold parts if any
              const boldMatch = item.match(/^\*\*(.*?)\*\*(.*)/);
              if (boldMatch) {
                return (
                  <li key={idx} className="flex items-start gap-xs font-body-sm text-[14px] text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                    <span>
                      <strong>{boldMatch[1]}</strong>
                      {boldMatch[2]}
                    </span>
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-xs font-body-sm text-[14px] text-on-surface">
                  <span className="material-symbols-outlined text-primary text-xs mt-1">check_circle</span>
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-md space-y-lg scroll-hide bg-surface-container-low/30 min-h-0">
      {/* Date Separator */}
      <div className="flex justify-center">
        <span className="text-[11px] font-label-md text-outline px-sm py-[2px] bg-surface-container rounded-full">Today</span>
      </div>

      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        if (isUser) {
          return (
            <div key={msg.id} className="flex flex-col items-end animate-in slide-in-from-right-4 duration-300">
              <div className="bg-primary-container text-on-primary-container px-md py-sm rounded-xl rounded-tr-none max-w-[85%] shadow-sm">
                <p className="font-body-sm text-[14px]">{msg.text}</p>
              </div>
              <span className="font-label-sm text-[12px] text-on-surface-variant mt-xs mr-xs">{msg.timestamp}</span>
            </div>
          );
        }

        // Bot message rendering
        const isFallback = msg.matched === false;

        return (
          <div key={msg.id} className="flex flex-col items-start animate-in slide-in-from-left-4 duration-500">
            <div className="flex gap-sm items-start max-w-[90%]">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
              
              <div className="space-y-md flex-1">
                {/* Text Bubble */}
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl rounded-tl-none shadow-sm">
                  {renderMessageContent(msg.text)}

                  {/* Feedback widget for matched answers */}
                  {!isFallback && (
                    <div className="mt-md pt-md border-t border-outline-variant flex items-center justify-between">
                      <span className="text-[12px] text-outline font-label-md">Was this helpful?</span>
                      <div className="flex gap-xs">
                        <button className="p-xs hover:bg-surface-container rounded-lg border border-outline-variant transition-all">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">thumb_up</span>
                        </button>
                        <button className="p-xs hover:bg-surface-container rounded-lg border border-outline-variant transition-all">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">thumb_down</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTAs Bento box for fallback state */}
                {isFallback && (
                  <div className="grid grid-cols-1 gap-sm pt-xs w-full">
                    <a
                      href="mailto:support@brand.com"
                      className="w-full flex items-center justify-between bg-primary text-on-primary px-lg py-md rounded-xl font-label-md hover:opacity-90 active:scale-[0.98] transition-all group"
                    >
                      <span className="flex items-center gap-sm">
                        <span className="material-symbols-outlined">headset_mic</span>
                        Contact Support
                      </span>
                      <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                    </a>
                    <button
                      onClick={() => onSelectChip('Shipping Info')}
                      className="w-full flex items-center justify-between border border-outline-variant bg-surface hover:bg-surface-container transition-colors px-lg py-md rounded-xl font-label-md active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-sm text-on-surface">
                        <span className="material-symbols-outlined text-on-surface-variant">library_books</span>
                        Browse Help Center
                      </span>
                    </button>
                    <div className="flex justify-center pt-xs">
                      <button
                        onClick={() => onSelectChip('Ask another question')}
                        className="font-label-md text-primary hover:underline flex items-center gap-xs text-[14px]"
                      >
                        <span className="material-symbols-outlined text-[18px]">replay</span>
                        Ask another question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Pulsating Typing Indicator */}
      {isLoading && (
        <div className="flex justify-start gap-sm items-center animate-pulse">
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant">
            <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant py-3 px-4 rounded-xl rounded-tl-none flex items-center gap-1">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};
