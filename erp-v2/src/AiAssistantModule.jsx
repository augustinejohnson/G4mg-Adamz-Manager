import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, FileText, BarChart3, Mail, MessageSquare } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs, query, limit, orderBy, doc, getDoc } from 'firebase/firestore';

export default function AiAssistantModule({ currentUser, currentTenant }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: `Hi ${currentUser?.name || 'there'}! I'm your Recloud AI Assistant. How can I help you today? I can summarize your sales data, draft emails, or analyze your inventory.` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);
  const [openAiKey, setOpenAiKey] = useState('');
  const [aiProvider, setAiProvider] = useState('openai');
  const [aiBaseUrl, setAiBaseUrl] = useState('');

  useEffect(() => {
    // Fetch global OpenAI key
    const fetchKey = async () => {
      try {
        const snap = await getDoc(doc(db, 'platform', 'settings'));
        if (snap.exists()) {
          setOpenAiKey(snap.data().openAiKey || '');
          setAiProvider(snap.data().aiProvider || 'openai');
          setAiBaseUrl(snap.data().aiBaseUrl || '');
        }
      } catch (err) {
        console.error("Error fetching OpenAI key", err);
      }
    };
    fetchKey();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // 1. Gather context data based on intent
      const lowerText = userMsg.text.toLowerCase();
      let contextStr = '';
      
      if (lowerText.includes('sale') || lowerText.includes('summarize')) {
        const salesSnap = await getDocs(query(collection(db, `organizations/${currentTenant}/sales`), orderBy('date', 'desc'), limit(10)));
        const recentSales = salesSnap.docs.map(d => d.data());
        contextStr = `Recent Sales Context:\n${JSON.stringify(recentSales.map(s => ({ total: s.totalAmount, items: s.cart?.length, payment: s.paymentMethod })), null, 2)}`;
      } else if (lowerText.includes('inventory') || lowerText.includes('stock')) {
        const stockSnap = await getDocs(query(collection(db, `organizations/${currentTenant}/inventory`), limit(20)));
        const stock = stockSnap.docs.map(d => d.data());
        contextStr = `Inventory Context:\n${JSON.stringify(stock.map(s => ({ item: s.name, qty: s.stockQuantity, price: s.sellingPrice })), null, 2)}`;
      }

      let responseText = '';

      if (openAiKey) {
        // Use real AI
        const prompt = `You are a helpful ERP AI Assistant for ReCloud ERP. The user is asking: "${userMsg.text}". Here is some live database context to help you answer (if applicable): ${contextStr}. Be concise and helpful. Format your response cleanly.`;
        
        let endpointUrl = 'https://api.openai.com/v1/chat/completions';
        let headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        };
        let bodyPayload = {
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: prompt }]
        };

        if (aiProvider === 'anthropic') {
          endpointUrl = 'https://api.anthropic.com/v1/messages';
          headers = {
            'Content-Type': 'application/json',
            'x-api-key': openAiKey,
            'anthropic-version': '2023-06-01'
          };
          bodyPayload = {
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }]
          };
        } else if (aiProvider === 'gemini') {
          // Gemini REST API URL usually embeds the key, but we'll adapt depending on standard setup
          // Using Google AI Studio endpoint for gemini-1.5-flash
          endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${openAiKey}`;
          headers = { 'Content-Type': 'application/json' };
          bodyPayload = {
            contents: [{ parts: [{ text: prompt }] }]
          };
        } else if (aiProvider === 'groq') {
          endpointUrl = 'https://api.groq.com/openai/v1/chat/completions';
          bodyPayload.model = 'llama3-8b-8192';
        } else if (aiProvider === 'custom') {
          endpointUrl = aiBaseUrl || 'https://api.openai.com/v1/chat/completions';
        }

        const res = await fetch(endpointUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(bodyPayload)
        });

        if (res.ok) {
          const data = await res.json();
          if (aiProvider === 'anthropic') {
            responseText = data.content[0].text;
          } else if (aiProvider === 'gemini') {
            responseText = data.candidates[0].content.parts[0].text;
          } else {
            responseText = data.choices[0].message.content;
          }
        } else {
          responseText = `Sorry, I encountered an error communicating with the ${aiProvider} AI service. Please check your API key or endpoint URL.`;
        }
      } else {
        // Fallback Rule-based engine
        responseText = "I'm running in offline heuristic mode (No OpenAI Key configured by SuperAdmin). ";
        if (lowerText.includes('email') || lowerText.includes('draft')) {
          responseText += "\n\nDraft email:\nSubject: Following up on your recent order\n\nHi [Customer Name],\nPlease let us know if you have any questions.\n\nBest regards,\nRecloud Team";
        } else if (lowerText.includes('sale') || lowerText.includes('summarize')) {
          responseText += `I fetched your last 10 sales from the database. Here is the raw context:\n\n${contextStr}`;
        } else if (lowerText.includes('inventory') || lowerText.includes('stock')) {
          responseText += `I fetched your top 20 inventory items. Here is the raw context:\n\n${contextStr}`;
        } else {
          responseText += "Try asking me to 'Draft an email', 'Summarize my sales', or 'Analyze my inventory'.";
        }
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "An error occurred while processing your request." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { icon: <Mail className="w-4 h-4" />, text: "Draft an email to a client" },
    { icon: <BarChart3 className="w-4 h-4" />, text: "Summarize my sales this month" },
    { icon: <FileText className="w-4 h-4" />, text: "Analyze my inventory levels" }
  ];

  return (
    <div className="flex flex-col w-full h-full md:min-h-[500px] rounded-3xl overflow-hidden relative border border-white/50 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 shadow-xl shadow-indigo-900/10 backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Sidebar Suggestions - hidden on mobile */}
      <div className="hidden md:flex w-72 bg-white/40 backdrop-blur-md border-r border-white/50 p-8 flex-col z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-black text-slate-800 text-lg">Recloud AI</h2>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Suggested Prompts</h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setInputText(s.text)}
                className="w-full text-left p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-900/5 transition-all text-sm text-slate-600 group"
              >
                <div className="text-purple-500 mb-2 group-hover:scale-110 transition-transform origin-left bg-white/80 w-8 h-8 rounded-full flex items-center justify-center shadow-sm">{s.icon}</div>
                <div className="font-medium">{s.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm z-10">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-2 p-3 border-b border-white/50 bg-white/40 backdrop-blur-md">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-black text-slate-800 text-base">Recloud AI</h2>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
          {/* Mobile suggestions - shown inline at top */}
          {messages.length <= 1 && (
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setInputText(s.text)}
                  className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white hover:border-purple-300 transition-all text-xs text-slate-600 font-medium"
                >
                  <span className="text-purple-500">{s.icon}</span>
                  <span className="whitespace-nowrap">{s.text}</span>
                </button>
              ))}
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-in slide-in-from-bottom-2`}>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {msg.role === 'ai' ? <Bot className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <User className="w-3.5 h-3.5 md:w-4 md:h-4" />}
              </div>
              <div className={`px-4 md:px-5 py-3 md:py-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-md ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-tr-sm shadow-slate-900/20' 
                  : 'bg-white/80 backdrop-blur-md text-slate-700 rounded-tl-sm border border-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 md:gap-4 max-w-[80%]">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <div className="px-4 py-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-8 bg-white/40 backdrop-blur-md border-t border-white/50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask Recloud AI anything..."
              className="w-full pl-4 md:pl-6 pr-14 py-3 md:py-4 bg-white/80 backdrop-blur-md border border-white rounded-2xl text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all shadow-lg shadow-indigo-900/5 placeholder-slate-400 font-medium text-slate-800"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all shadow-md shadow-purple-500/30 transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </form>
          <div className="text-center mt-2 md:mt-3">
            <span className="text-[10px] text-slate-400 font-medium">AI Assistant can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

