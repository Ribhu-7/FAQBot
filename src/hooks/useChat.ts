import { useState, useEffect } from 'react';
import { Message } from '../components/MessageList';

const INITIAL_WELCOME = "Hello! I'm your FAQ Assistant. How can I help you today?";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Default open for demonstration

  // Initialize with welcome message
  useEffect(() => {
    const defaultWelcome: Message = {
      id: 'welcome',
      sender: 'bot',
      text: INITIAL_WELCOME,
      matched: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([defaultWelcome]);
  }, []);

  const sendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer,
        matched: data.matched,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Fetch error, falling back to local simulation:', err);
      
      // Simulate matching using local /faq.json if backend is not running
      try {
        const localFaqsResponse = await fetch('/faq.json');
        const faqs = await localFaqsResponse.json();
        
        // Find simple semantic/word-based match for simulation
        const matchedFaq = faqs.find((f: { question: string }) => 
          text.toLowerCase().includes(f.question.toLowerCase().split(' ').slice(-2).join(' ')) ||
          f.question.toLowerCase().includes(text.toLowerCase())
        );

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: matchedFaq 
            ? matchedFaq.answer 
            : "I'm sorry, I couldn't find a specific answer for that. Would you like to speak with a support representative or check our full help center?",
          matched: !!matchedFaq,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Add short delay to simulate network latency
        await new Promise(resolve => setTimeout(resolve, 800));
        setMessages((prev) => [...prev, botMsg]);
      } catch (localErr) {
        // Ultimate fallback
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "I'm sorry, I couldn't find an answer. Please contact us for support.",
          matched: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectChip = (question: string) => {
    if (question === 'Ask another question') {
      const resetMsg: Message = {
        id: `bot-reset-${Date.now()}`,
        sender: 'bot',
        text: "Sure! What else can I help you with?",
        matched: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, resetMsg]);
    } else {
      sendMessage(question);
    }
  };

  const toggleOpen = () => setIsOpen((prev) => !isOpen);

  return {
    messages,
    isLoading,
    isOpen,
    sendMessage,
    selectChip,
    toggleOpen,
  };
};
