import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Hash, Users, Search, Send, Plus, MoreVertical, Paperclip, Smile, X, ArrowLeft, Trash2 } from 'lucide-react';
import { getChatChannels, addChatChannel, deleteChatChannel, getChatMessages, addChatMessage, db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function DiscussModule({ currentTenant, currentUser, employees = [] }) {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [showChannelsSidebar, setShowChannelsSidebar] = useState(true);
  const scrollContainerRef = useRef(null);

  const dms = employees.filter(emp => emp.id !== currentUser?.id);



  useEffect(() => {
    loadChannels();
  }, [currentTenant]);

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
    }
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const loadChannels = async () => {
    try {
      const data = await getChatChannels(currentTenant);
      const visibleChannels = data.filter(c => {
        if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') return true;
        if (!c.members || c.members.length === 0) return true;
        return c.members.includes(currentUser?.id);
      });
      setChannels(visibleChannels);
      if (visibleChannels.length > 0 && !activeChannel) {
        setActiveChannel(visibleChannels[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (channelId) => {
    try {
      const data = await getChatMessages(channelId, currentTenant);
      // Sort messages by timestamp
      const sorted = data.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeA - timeB;
      });
      setMessages(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    try {
      const finalMembers = selectedMembers.length > 0 && currentUser?.id && !selectedMembers.includes(currentUser.id) 
        ? [...selectedMembers, currentUser.id] 
        : selectedMembers;

      await addChatChannel({
        name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
        type: 'public',
        createdBy: currentUser?.name || 'Admin',
        members: finalMembers
      }, currentTenant);
      setNewChannelName('');
      setSelectedMembers([]);
      setIsAddingChannel(false);
      loadChannels();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChannel = async () => {
    if (!activeChannel || activeChannel.isDM) return;
    if (!window.confirm(`Are you sure you want to delete #${activeChannel.name}?`)) return;
    try {
      await deleteChatChannel(activeChannel.id, currentTenant);
      setActiveChannel(null);
      loadChannels();
    } catch (err) {
      console.error(err);
      alert("Error deleting channel");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChannel) return;
    try {
      const msgData = {
        text: newMessageText,
        author: currentUser?.name || 'Admin',
        authorId: currentUser?.id || 'admin',
        attachment: attachedFile
      };
      await addChatMessage(activeChannel.id, msgData, currentTenant);
      setNewMessageText('');
      setAttachedFile(null);
      loadMessages(activeChannel.id); // Reload to show new message
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachClick = () => {
    const mockFiles = ['report_q3.pdf', 'design_assets.zip', 'contract_v2.docx', 'budget_2027.xlsx'];
    setAttachedFile(mockFiles[Math.floor(Math.random() * mockFiles.length)]);
  };

  const handleSelectChannel = (channel) => {
    setActiveChannel(channel);
    setShowChannelsSidebar(false); // Auto-hide sidebar on mobile after selecting
  };

  const handleAddMembersToChannel = async (e) => {
    e.preventDefault();
    if (!activeChannel || activeChannel.isDM) return;
    try {
      const channelRef = doc(db, `organizations/${currentTenant}/chatChannels`, activeChannel.id);
      await updateDoc(channelRef, {
        members: selectedMembers
      });
      setShowAddMember(false);
      loadChannels();
      setActiveChannel({...activeChannel, members: selectedMembers});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] rounded-3xl overflow-hidden relative border border-white/50 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 shadow-xl shadow-indigo-900/10 backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Sidebar - Channels list */}
      <div className={`${showChannelsSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-white/40 backdrop-blur-md border-r border-white/50 flex-col z-10 absolute md:relative inset-0 md:inset-auto`}>
        <div className="p-4 md:p-6 border-b border-white/50">
          <div className="flex justify-between items-center">
            <h2 className="font-black text-slate-800 text-xl flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-recloud-600 drop-shadow-sm" /> Discuss
            </h2>
            <button className="text-slate-400 hover:text-slate-600 transition-colors tooltip" title="Search">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex justify-between items-center mb-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Channels</span>
            <button onClick={() => setIsAddingChannel(true)} className="hover:text-recloud-500 transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
          
          {isAddingChannel && (
            <form onSubmit={handleAddChannel} className="mb-2 px-2 bg-white/50 p-2 rounded-xl">
              <input 
                type="text" 
                autoFocus 
                placeholder="# channel-name" 
                value={newChannelName} 
                onChange={(e) => setNewChannelName(e.target.value)}
                className="w-full text-sm px-2 py-1.5 rounded-lg border border-recloud-200 focus:border-recloud-500 outline-none bg-white shadow-sm mb-2"
              />
              <div className="max-h-32 overflow-y-auto mb-2 space-y-1">
                {employees.map(emp => (
                  <label key={emp.id} className="flex items-center gap-2 text-xs text-slate-700">
                    <input 
                      type="checkbox" 
                      checked={selectedMembers.includes(emp.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedMembers([...selectedMembers, emp.id]);
                        else setSelectedMembers(selectedMembers.filter(id => id !== emp.id));
                      }}
                    />
                    {emp.name}
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-recloud-600 text-white text-xs py-1 rounded-lg font-bold">Create</button>
                <button type="button" onClick={() => { setIsAddingChannel(false); setNewChannelName(''); setSelectedMembers([]); }} className="flex-1 bg-slate-200 text-slate-700 text-xs py-1 rounded-lg font-bold">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-0.5">
            {channels.length === 0 && !isAddingChannel && (
              <div className="px-2 py-2 text-sm text-slate-400">No channels yet.</div>
            )}
            {channels.map(channel => (
              <button 
                key={channel.id} 
                onClick={() => handleSelectChannel(channel)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeChannel?.id === channel.id ? 'bg-recloud-100 text-recloud-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'}`}
              >
                <Hash className={`w-4 h-4 ${activeChannel?.id === channel.id ? 'text-recloud-500' : 'text-slate-400'}`} /> 
                {channel.name}
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center mb-2 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Direct Messages</span>
            <button className="hover:text-recloud-500 transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="space-y-0.5">
            {dms.map(user => {
              const dmId = [currentUser?.id || 'admin', user.id].sort().join('_');
              return (
              <button 
                key={user.id} 
                onClick={() => handleSelectChannel({ ...user, id: dmId, isDM: true, originalId: user.id })}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeChannel?.id === user.id ? 'bg-recloud-100 text-recloud-700' : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'}`}
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden border border-white">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} alt={user.name} />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${user.status === 'online' ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                </div>
                <span className="truncate">{user.name}</span>
              </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${!showChannelsSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-white/40 backdrop-blur-md z-10`}>
        {activeChannel ? (
          <>
            {/* Chat Header */}
            <div className="px-4 md:px-8 py-4 md:py-5 border-b border-white/50 flex justify-between items-center bg-white/40 backdrop-blur-md z-10">
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  className="md:hidden flex items-center justify-center p-2 mr-2 text-slate-600 hover:text-slate-900 bg-slate-200/50 hover:bg-slate-200 rounded-xl transition-all"
                  onClick={() => setShowChannelsSidebar(true)}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                {activeChannel.isDM ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${activeChannel.name}&background=random&color=fff`} alt={activeChannel.name} />
                  </div>
                ) : (
                  <Hash className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
                )}
                <div>
                  <h3 className="font-black text-slate-800 text-base md:text-lg">{activeChannel.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    {activeChannel.isDM ? (
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 1 member</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {activeChannel.members?.length || 1} members
                      </span>
                    )}
                    {!activeChannel.isDM && activeChannel.createdBy && (
                      <>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">Created by {activeChannel.createdBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!activeChannel.isDM && (
                  <button onClick={() => {
                    setSelectedMembers(activeChannel.members || []);
                    setShowAddMember(true);
                  }} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Members
                  </button>
                )}
                {!activeChannel.isDM && (currentUser?.role === 'admin' || activeChannel.createdBy === currentUser?.name) && (
                  <button onClick={handleDeleteChannel} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete Channel">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {showAddMember && !activeChannel.isDM && (
              <div className="absolute top-20 right-4 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-700 text-sm">Manage Members</h3>
                  <button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddMembersToChannel} className="p-3">
                  <div className="max-h-48 overflow-y-auto space-y-2 mb-3 pr-2 custom-scrollbar">
                    {employees.map(emp => (
                      <label key={emp.id} className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-50 p-1.5 rounded-lg cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedMembers.includes(emp.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedMembers([...selectedMembers, emp.id]);
                            else setSelectedMembers(selectedMembers.filter(id => id !== emp.id));
                          }}
                          className="rounded text-recloud-600 focus:ring-recloud-500"
                        />
                        {emp.name}
                      </label>
                    ))}
                  </div>
                  <button type="submit" className="w-full bg-recloud-600 text-white font-bold text-sm py-2 rounded-xl hover:bg-recloud-700 transition-colors shadow-sm">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-slate-700">Welcome to {activeChannel.isDM ? activeChannel.name : `#${activeChannel.name}`}!</h3>
                    <p className="text-sm">This is the beginning of the chat history.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.authorId === (currentUser?.id || 'admin');
                  return (
                    <div key={msg.id || idx} className={`flex gap-3 md:gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                        {isMe ? (
                          <img src={`https://ui-avatars.com/api/?name=${msg.author}&background=0D8ABC&color=fff`} alt={msg.author} />
                        ) : (
                          <img src={`https://ui-avatars.com/api/?name=${msg.author}&background=94a3b8&color=fff`} alt={msg.author} />
                        )}
                      </div>
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%]`}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-slate-700 text-sm">{isMe ? 'You' : msg.author}</span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        <div className={`px-4 md:px-5 py-2.5 md:py-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-recloud-600 text-white rounded-tr-sm shadow-recloud-500/20' : 'bg-white/80 backdrop-blur-sm text-slate-700 rounded-tl-sm border border-white'}`}>
                          {msg.text}
                          {msg.attachment && (
                            <div className={`mt-2 flex items-center gap-2 p-2 rounded-xl text-xs font-medium border ${isMe ? 'bg-black/10 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="truncate">{msg.attachment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Form */}
            <div className="p-3 md:p-4 bg-white/40 backdrop-blur-md border-t border-white/50">
              {attachedFile && (
                <div className="mb-3 flex items-center gap-2">
                  <div className="bg-recloud-50 text-recloud-700 border border-recloud-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                    <Paperclip className="w-3.5 h-3.5" />
                    {attachedFile}
                    <button onClick={() => setAttachedFile(null)} className="hover:bg-recloud-200 rounded-full p-0.5 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/60 focus-within:border-recloud-400 focus-within:ring-2 focus-within:ring-recloud-500/20 shadow-sm transition-all">
                <button type="button" onClick={handleAttachClick} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder={activeChannel.isDM ? `Message ${activeChannel.name}...` : `Message #${activeChannel.name}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 px-2 min-w-0"
                />
                <button type="button" className="hidden md:block p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <Smile className="w-5 h-5" />
                </button>
                <button 
                  type="submit" 
                  disabled={!newMessageText.trim() && !attachedFile}
                  className="p-2 bg-recloud-600 text-white rounded-xl hover:bg-recloud-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-recloud-500/30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <button 
              className="md:hidden mb-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setShowChannelsSidebar(true)}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <MessageSquare className="w-12 h-12 mb-4 text-slate-300" />
            <p>Select a channel to start discussing</p>
          </div>
        )}
      </div>
    </div>
  );
}

