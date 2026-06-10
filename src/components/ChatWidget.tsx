import React from 'react';
import { MessageList } from './MessageList';
import { QuickActionChips } from './QuickActionChips';
import { MessageInput } from './MessageInput';
import { useChat } from '../hooks/useChat';

export const ChatWidget: React.FC = () => {
  const {
    messages,
    isLoading,
    isOpen,
    sendMessage,
    selectChip,
    toggleOpen
  } = useChat();

  return (
    <>
      {/* Backdrop overlay (closes chat on click) */}
      <div
        onClick={toggleOpen}
        className={`fixed inset-0 bg-on-background/20 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Centered Chat Window Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-md pointer-events-none">
        <div
          className={`chat-shadow bg-surface-container-lowest w-[380px] h-[600px] rounded-xl flex flex-col overflow-hidden border border-outline-variant transition-all duration-300 pointer-events-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
            }`}
        >
          {/* Header */}
          <div className="bg-primary p-md flex items-center justify-between text-on-primary select-none shrink-0">
            <div className="flex items-center gap-sm">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center border border-on-primary/30 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="FAQ Assistant Bot"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwkeNSz18E5h65mqRXlHoziKbsEGTOE4vHj4z2x22AIgNx5UXBgaOy5rs65qj44ANPHBbarcEuNnFox_RbXk4Po8tvWoUAM7x3Kxqk1zWQoNV3xA96MXPk-98bJjyGUSLv9ZQMrVAFB3xqRwXtgk9pMfor4pI0YvucMDbOC8ZvpTu4-UZanOrgogzjACXlQBV4u3QgP0Joib4qz3XNinURZTyj7JGMUg_6-LT5M0fA-9WZgNk6FEy9v2RJyfdJAaEal_fmRcYj_S8"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></div>
              </div>
              <div>
                <h2 className="font-geist text-[16px] font-semibold leading-tight">FAQ Assistant</h2>
                <p className="text-[10px] opacity-80 uppercase tracking-wider font-bold">Online • Typically replies in 1m</p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="p-xs hover:bg-on-primary/10 rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Scrollable messages area */}
          <MessageList messages={messages} isLoading={isLoading} onSelectChip={selectChip} />

          {/* Quick actions wrapper (render only if not loading) */}
          {/* {!isLoading && (
            <div className="py-sm bg-surface-container-low/20">
              <QuickActionChips onSelectChip={selectChip} />
            </div>
          )} */}

          {/* Input box */}
          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>

      {/* Floating Launcher Button */}
      <div className="fixed bottom-gutter right-gutter z-50">
        <button
          onClick={toggleOpen}
          className="w-14 h-14 bg-primary text-on-primary rounded-full chat-shadow flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? 'close' : 'chat_bubble'}
          </span>
        </button>
      </div>
    </>
  );
};
