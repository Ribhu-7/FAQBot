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
        
        // Find a robust keyword-overlap match for simulation (handling different word orders and word stems)
        const cleanTokens = (str: string) => {
          const stopWords = new Set([
            'what', 'is', 'your', 'do', 'you', 'a', 'the', 'to', 'for', 'in', 'of', 'can', 'i', 
            'how', 'are', 'on', 'with', 'at', 'my', 'or', 'and', 'about', 'please', 'any', 
            'some', 'me', 'we', 'us', 'does', 'did', 'have', 'has', 'had', 'tell', 'info'
          ]);
          return str
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 1 && !stopWords.has(word));
        };

        const userTokens = cleanTokens(text);
        let matchedFaq = null;
        let highestScore = 0;

        if (userTokens.length > 0) {
          for (const faq of faqs) {
            const faqTokens = cleanTokens(faq.question);
            // Count overlapping tokens (supporting partial/stem matches, e.g. "returns" matches "return")
            const overlap = userTokens.filter(ut => 
              faqTokens.some(ft => ft.includes(ut) || ut.includes(ft))
            ).length;

            const score = overlap / Math.min(userTokens.length, faqTokens.length);

            // We require at least 1 overlapping key word and a minimum score of 0.4
            if (overlap >= 1 && score > highestScore && score >= 0.4) {
              highestScore = score;
              matchedFaq = faq;
            }
          }
        }

        // If no token match, fall back to simple substring match
        if (!matchedFaq) {
          matchedFaq = faqs.find((f: { question: string }) => 
            f.question.toLowerCase().includes(text.toLowerCase()) ||
            text.toLowerCase().includes(f.question.toLowerCase())
          );
        }

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
