import React, { useState, useEffect, useRef } from 'react';
import { KnowledgeDocRecord, VoiceInteractionRecord, AllyChatMessage } from '../types';
import { 
  Bot, 
  Mic, 
  Square, 
  Send, 
  FileText, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Paperclip, 
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';

interface AiAssistantViewProps {
  onAskQuestion: (question: string) => Promise<{ answer: string; citations?: any[]; tool_results?: any[] }>;
  onAskVoice: (audioBlob: Blob) => Promise<{ transcript?: string; answer_text?: string; audio_base64?: string; citations?: any[] }>;
  knowledgeDocs: KnowledgeDocRecord[];
  onUploadDoc: (file: File) => Promise<any>;
  onReingest: () => Promise<any>;
  isCaregiver: boolean;
}

export default function AiAssistantView({
  onAskQuestion,
  onAskVoice,
  knowledgeDocs,
  onUploadDoc,
  onReingest,
  isCaregiver,
}: AiAssistantViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'knowledge'>('chat');
  const [messages, setMessages] = useState<AllyChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ally',
      text: 'Hello! I am Ally Healthwise, your AI clinical medication assistant. How can I help you regarding drug instructions, compartment schedules, or patient guidelines today?',
      timestamp: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Knowledge File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isReingesting, setIsReingesting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAsking) return;

    const userMsg: AllyChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const q = inputText;
    setInputText('');
    setIsAsking(true);

    try {
      const res = await onAskQuestion(q);
      const allyMsg: AllyChatMessage = {
        id: `msg-ans-${Date.now()}`,
        sender: 'ally',
        text: res.answer,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, allyMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ally',
          text: 'I apologize, I encountered an issue retrieving clinical guidelines. Please verify system connection or try rephrasing.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // Audio Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
        await processVoiceQuery(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or unavailable in this environment.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const processVoiceQuery = async (blob: Blob) => {
    setIsAsking(true);
    const userVoiceMsg: AllyChatMessage = {
      id: `msg-v-${Date.now()}`,
      sender: 'user',
      text: '🎙️ Spoken Voice Audio Query sent to Ally Assistant...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userVoiceMsg]);

    try {
      const res = await onAskVoice(blob);
      const answerText = res.answer_text || 'Voice query processed successfully.';
      
      const allyMsg: AllyChatMessage = {
        id: `msg-v-ans-${Date.now()}`,
        sender: 'ally',
        text: answerText,
        audioBase64: res.audio_base64,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, allyMsg]);

      if (res.audio_base64) {
        const audio = new Audio(`data:audio/wav;base64,${res.audio_base64}`);
        audio.play().catch(() => {});
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-v-err-${Date.now()}`,
          sender: 'ally',
          text: 'Failed to process voice audio recording.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await onUploadDoc(selectedFile);
      alert(`Knowledge Document "${selectedFile.name}" uploaded. Index rebuild triggered.`);
      setSelectedFile(null);
    } catch (err) {
      alert('Failed to upload knowledge document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReingestClick = async () => {
    setIsReingesting(true);
    try {
      await onReingest();
      alert('Ally AI Vector Index re-ingestion initiated.');
    } catch (err) {
      alert('Failed to trigger re-ingest.');
    } finally {
      setIsReingesting(false);
    }
  };

  return (
    <div id="ai-assistant-tab-panel" className="space-y-6">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#c3c6d5]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c2d] flex items-center gap-2">
            Ally Healthwise AI Assistant
            <span className="bg-[#e6eeff] text-[#003482] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#c3c6d5]">
              RAG & Voice Q&A
            </span>
          </h2>
          <p className="text-[#434652] text-sm mt-1">
            Clinical medication Q&A, patient dosage guidance, and care-plan PDF knowledge ingestion.
          </p>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex bg-[#e6eeff] p-1 rounded-lg border border-[#c3c6d5]">
          <button 
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'chat' ? 'bg-[#003482] text-white shadow-xs' : 'text-[#003482] hover:bg-[#dce9ff]'
            }`}
          >
            Assistant Chat
          </button>
          {isCaregiver && (
            <button 
              onClick={() => setActiveSubTab('knowledge')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'knowledge' ? 'bg-[#003482] text-white shadow-xs' : 'text-[#003482] hover:bg-[#dce9ff]'
              }`}
            >
              Knowledge Vector Base
            </button>
          )}
        </div>
      </header>

      {/* CHAT TAB */}
      {activeSubTab === 'chat' && (
        <div className="bg-white border border-[#c3c6d5] rounded-xl shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Top Banner */}
          <div className="bg-[#f8f9ff] px-6 py-3 border-b border-[#c3c6d5] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003482]">
              <Bot className="w-5 h-5 text-[#003482]" />
              Ally Healthwise Clinical Agent (Gemini Powered)
            </div>
            <span className="text-[11px] text-[#737784] font-mono">Status: Ready (Voice + RAG)</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user' ? 'bg-[#003482] text-white' : 'bg-[#e6eeff] text-[#003482] border border-[#c3c6d5]'
                }`}>
                  {msg.sender === 'user' ? 'You' : <Bot className="w-4 h-4 text-[#003482]" />}
                </div>

                <div className={`p-4 rounded-xl text-xs space-y-2 border ${
                  msg.sender === 'user' 
                    ? 'bg-[#003482] text-white border-[#003482]' 
                    : 'bg-white text-[#0f1c2d] border-[#c3c6d5] shadow-xs'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio playback button if base64 present */}
                  {msg.audioBase64 && (
                    <button 
                      onClick={() => {
                        const audio = new Audio(`data:audio/wav;base64,${msg.audioBase64}`);
                        audio.play();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 bg-[#eff4ff] text-[#003482] px-3 py-1.5 rounded-md font-bold text-[11px] hover:bg-[#e6eeff] cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen to Spoken Answer Audio
                    </button>
                  )}

                  {/* Citations block */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 mt-2 space-y-1">
                      <span className="font-bold text-[10px] text-[#737784] uppercase tracking-wider block">Sources & Citations</span>
                      {msg.citations.map((c: any, idx: number) => (
                        <div key={idx} className="text-[10px] text-[#003482] font-mono flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {c.doc || c.filename || 'Clinical Guidelines Document'} {c.page ? `(Page ${c.page})` : ''}
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`text-[10px] block text-right mt-1 ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-[#737784]'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-[#e6eeff] text-[#003482] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#c3c6d5] p-4 rounded-xl text-xs text-[#737784] flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#003482]" />
                  Ally is evaluating clinical knowledge vector index...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendText} className="p-4 bg-white border-t border-[#c3c6d5] flex items-center gap-3">
            
            {/* Audio Record Toggle Button */}
            {!isRecording ? (
              <button 
                type="button"
                onClick={startRecording}
                className="p-2.5 rounded-lg bg-[#eff4ff] text-[#003482] hover:bg-[#e6eeff] transition-all cursor-pointer"
                title="Hold to Record Voice Query"
              >
                <Mic className="w-5 h-5 text-[#003482]" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={stopRecording}
                className="p-2.5 rounded-lg bg-red-600 text-white animate-pulse transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <Square className="w-4 h-4" />
                {recordingTime}s
              </button>
            )}

            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isRecording ? 'Listening to voice recording...' : 'Ask Ally about medication instructions, schedule, side effects...'}
              disabled={isRecording || isAsking}
              className="flex-1 px-4 py-2.5 border border-[#c3c6d5] rounded-lg text-xs outline-none focus:border-[#003482] text-[#0f1c2d]"
            />

            <button 
              type="submit"
              disabled={!inputText.trim() || isAsking || isRecording}
              className="bg-[#003482] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#0c4aac] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              Ask
            </button>
          </form>

        </div>
      )}

      {/* KNOWLEDGE VECTOR BASE TAB (Caregiver only) */}
      {activeSubTab === 'knowledge' && isCaregiver && (
        <div className="space-y-6">
          
          {/* Upload Knowledge PDF Box */}
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0f1c2d] flex items-center gap-2">
              <Upload className="w-4.5 h-4.5 text-[#003482]" />
              Upload Care Plan & Medication Guide PDF
            </h3>
            <p className="text-xs text-[#737784]">
              Upload medical PDFs, discharge notes, or drug interaction sheets. The Ally AI assistant ingests these documents into its local vector index.
            </p>

            <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row items-center gap-3">
              <input 
                type="file" 
                accept=".pdf,.txt,.md"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="text-xs text-[#737784] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#eff4ff] file:text-[#003482] hover:file:bg-[#e6eeff] cursor-pointer"
              />

              <button 
                type="submit"
                disabled={!selectedFile || isUploading}
                className="bg-[#003482] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#0c4aac] transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Ingesting PDF...' : 'Ingest Document'}
              </button>
            </form>
          </section>

          {/* List of Knowledge Docs */}
          <section className="bg-white border border-[#c3c6d5] rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#c3c6d5] pb-4">
              <h3 className="text-sm font-bold text-[#0f1c2d] flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-[#003482]" />
                Ingested Knowledge Base Documents
              </h3>

              <button 
                onClick={handleReingestClick}
                disabled={isReingesting}
                className="px-4 py-2 bg-[#eff4ff] text-[#003482] rounded-lg text-xs font-bold hover:bg-[#e6eeff] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-4 h-4 ${isReingesting ? 'animate-spin' : ''}`} />
                {isReingesting ? 'Re-ingesting Index...' : 'Re-trigger Index Reingest'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#c3c6d5] text-[#737784] bg-[#f8f9ff]">
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Document Filename</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Ingest Status</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Uploaded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d5]">
                  {knowledgeDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono text-[#003482] font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#737784]" />
                        {doc.filename}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          doc.ingest_status === 'ingested' 
                            ? 'bg-[#91f8ad] text-[#00743b]' 
                            : 'bg-red-100 text-[#ba1a1a]'
                        }`}>
                          {doc.ingest_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#737784] font-mono">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
