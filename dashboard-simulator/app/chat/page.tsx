"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  RefreshCw,
  Play,
  Clock,
  Hash,
  Activity,
} from "lucide-react";

type ScriptItem = {
  key: string;
  name: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const API_BASE = "http://127.0.0.1:8000";

export default function ChatPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [selectedScript, setSelectedScript] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadScripts();
  }, []);

  useEffect(() => {
    if (conversation.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, loading, pendingTranscript]);

  useEffect(() => {
    return () => {
      stopTracks();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  async function loadScripts() {
    try {
      const res = await fetch(`${API_BASE}/scripts`);
      if (!res.ok) throw new Error("לא ניתן לטעון תסריטים");
      const data = await res.json();
      setScripts(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStartChat() {
    if (!selectedScript) {
      alert("בחרי תסריט");
      return;
    }

    try {
      setLoading(true);
      setPendingTranscript("");
      setConversation([]);
      setSessionId("");

      const formData = new FormData();
      formData.append("script_key", selectedScript);

      const res = await fetch(`${API_BASE}/chat/start`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "שגיאה בפתיחת שיחה");
      }

      const data = await res.json();
      setSessionId(data.session_id);
      setConversation(data.conversation || []);
    } catch (error) {
      console.error(error);
      alert("שגיאה בפתיחת השיחה");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendText() {
    if (!sessionId) {
      alert("צריך להתחיל שיחה קודם");
      return;
    }

    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setPendingTranscript("");

      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("message", trimmed);

      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "שגיאה בשליחת הודעה");
      }

      const data = await res.json();
      setConversation(data.conversation || []);
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("שגיאה בשליחת הודעה");
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    if (!sessionId) {
      alert("צריך להתחיל שיחה קודם");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blobType = mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });

        const extension = blobType.includes("mp4")
          ? "mp4"
          : blobType.includes("ogg")
          ? "ogg"
          : "webm";

        const audioFile = new File([audioBlob], `recording.${extension}`, {
          type: blobType,
        });

        await sendRecordedAudio(audioFile);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("לא הצלחתי לגשת למיקרופון");
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopTracks();
  }

  function stopTracks() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  async function sendRecordedAudio(file: File) {
    if (!sessionId) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("audio_file", file);

      const res = await fetch(`${API_BASE}/chat/audio-message`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "שגיאה בשליחת ההקלטה");
      }

      const data = await res.json();
      // Show the transcription first, then the thinking indicator
      setPendingTranscript(data.transcribed_text || "");
      setConversation(data.conversation || []);
    } catch (error) {
      console.error(error);
      alert("שגיאה בשליחת ההקלטה");
    } finally {
      setLoading(false);
      setPendingTranscript("");
      audioChunksRef.current = [];
      setRecordingSeconds(0);
    }
  }

  function getSupportedMimeType() {
    const possibleTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    for (const type of possibleTypes) {
      if (
        typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported(type)
      ) {
        return type;
      }
    }

    return "";
  }

  function formatSeconds(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  function resetChat() {
    if (isRecording) {
      stopRecording();
    }

    setSessionId("");
    setConversation([]);
    setMessage("");
    setPendingTranscript("");
    setSelectedScript("");
    setLoading(false);
    setRecordingSeconds(0);
  }

  const canSendText = useMemo(() => {
    return !!sessionId && !!message.trim() && !loading && !isRecording;
  }, [sessionId, message, loading, isRecording]);

  const getStatusBadge = () => {
    if (isRecording) {
      return (
        <Badge variant="destructive" className="gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
          מקליט
        </Badge>
      );
    }
    if (loading) {
      return (
        <Badge variant="secondary" className="gap-1.5">
          <Activity className="h-3 w-3 animate-pulse" />
          ממתין לתגובה
        </Badge>
      );
    }
    if (sessionId) {
      return (
        <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100/90">
          <Activity className="h-3 w-3" />
          שיחה פעילה
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1.5">
        <Clock className="h-3 w-3" />
        טרם התחילה שיחה
      </Badge>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50" dir="rtl">
      <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="mb-4 shrink-0 border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    סימולציית נציג שירות ביטוח
                  </h1>
                  <p className="text-sm text-slate-500">
                    התחילי שיחה, שלחי טקסט או הקליטי ישירות מהמיקרופון.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={selectedScript}
                  onValueChange={setSelectedScript}
                  disabled={loading || !!sessionId}
                >
                  <SelectTrigger className="w-[160px] border-slate-200">
                    <SelectValue placeholder="בחרי תסריט" />
                  </SelectTrigger>
                  <SelectContent>
                    {scripts.map((script) => (
                      <SelectItem key={script.key} value={script.key}>
                        {script.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleStartChat}
                  disabled={loading || !selectedScript || !!sessionId}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Play className="h-4 w-4" />
                  {loading && !sessionId ? "פותח שיחה..." : "התחל שיחה"}
                </Button>

                <Button variant="outline" onClick={resetChat} className="gap-2 border-slate-200">
                  <RefreshCw className="h-4 w-4" />
                  שיחה חדשה
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_280px]">
          {/* Chat Area */}
          <Card className="flex min-h-0 flex-col border-slate-200 shadow-sm">
            <CardHeader className="shrink-0 border-b border-slate-200 py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  התכתבות
                </CardTitle>
                {getStatusBadge()}
              </div>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="min-h-0 flex-1 bg-slate-100/50">
                <div className="p-4">
                  {conversation.length === 0 ? (
                    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200">
                        <MessageCircle className="h-7 w-7 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">
                          עדיין אין שיחה
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {"בחרי תסריט ולחצי על \"התחל שיחה\" כדי להתחיל"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversation.map((msg, index) => {
                        const isAgent = msg.role === "user";

                        return (
                          <div
                            key={`${index}-${msg.content.slice(0, 20)}`}
                            className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                                isAgent
                                  ? "border border-emerald-200 bg-emerald-50 text-slate-900"
                                  : "bg-emerald-600 text-white"
                              }`}
                            >
                              <div
                                className={`mb-1 text-xs font-semibold ${
                                  isAgent
                                    ? "text-emerald-700"
                                    : "text-emerald-100"
                                }`}
                              >
                                {isAgent ? "נציג" : "לקוח"}
                              </div>
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {msg.content}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Show pending transcript first, then thinking indicator */}
                      {pendingTranscript && (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-sm">
                            <div className="mb-1 text-xs font-semibold text-emerald-100">
                              נציג (תמלול)
                            </div>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {pendingTranscript}
                            </div>
                          </div>
                        </div>
                      )}

                      {loading && sessionId && (
                        <div className="flex justify-end">
                          <div className="rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-sm">
                            <div className="mb-1 text-xs font-semibold text-emerald-100">
                              לקוח
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="flex gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="shrink-0 border-t border-slate-200 bg-white p-3">
                <div className="space-y-3">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="כתבי כאן את תגובת הנציג..."
                    disabled={!sessionId || loading || isRecording}
                    className="min-h-[80px] resize-none border-slate-200"
                  />

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {!isRecording ? (
                        <Button
                          variant="destructive"
                          onClick={startRecording}
                          disabled={!sessionId || loading}
                          className="gap-2"
                          size="sm"
                        >
                          <Mic className="h-4 w-4" />
                          התחל הקלטה
                        </Button>
                      ) : (
                        <Button
                          variant="destructive"
                          onClick={stopRecording}
                          className="gap-2 animate-pulse"
                          size="sm"
                        >
                          <MicOff className="h-4 w-4" />
                          עצור ושלח
                        </Button>
                      )}

                      <Button
                        onClick={handleSendText}
                        disabled={!canSendText}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                        שלחי הודעה
                      </Button>
                    </div>

                    <div className="text-sm">
                      {isRecording ? (
                        <Badge
                          variant="destructive"
                          className="gap-2 px-3 py-1"
                        >
                          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                          מקליט: {formatSeconds(recordingSeconds)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-2 px-3 py-1">
                          <Mic className="h-3 w-3" />
                          אפשר להקליד או להקליט
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Session Details Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-emerald-600" />
                  פרטי שיחה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    Session ID:
                  </span>
                  <span className="max-w-[140px] break-all text-left text-xs font-mono text-slate-700">
                    {sessionId ? sessionId.slice(0, 16) + "..." : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    מספר הודעות:
                  </span>
                  <Badge variant="secondary" className="text-xs">{conversation.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    סטטוס:
                  </span>
                  {getStatusBadge()}
                </div>
              </CardContent>
            </Card>

            {/* Color Legend Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  הסבר צבעים
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded border border-emerald-200 bg-emerald-50" />
                  <span className="text-sm text-slate-700">נציג</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-emerald-600" />
                  <span className="text-sm text-slate-700">לקוח</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   MessageCircle,
//   Mic,
//   MicOff,
//   Send,
//   RefreshCw,
//   Play,
//   FileText,
//   Clock,
//   Hash,
//   Activity,
// } from "lucide-react";

// type ScriptItem = {
//   key: string;
//   name: string;
// };

// type ChatMessage = {
//   role: "user" | "assistant";
//   content: string;
// };

// const API_BASE = "http://127.0.0.1:8000";

// export default function ChatPage() {
//   const [scripts, setScripts] = useState<ScriptItem[]>([]);
//   const [selectedScript, setSelectedScript] = useState("");
//   const [sessionId, setSessionId] = useState("");
//   const [conversation, setConversation] = useState<ChatMessage[]>([]);
//   const [message, setMessage] = useState("");
//   const [lastTranscript, setLastTranscript] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingSeconds, setRecordingSeconds] = useState(0);

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const timerRef = useRef<number | null>(null);
//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     loadScripts();
//   }, []);

//   useEffect(() => {
//     if (conversation.length > 0) {
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [conversation, loading]);

//   useEffect(() => {
//     return () => {
//       stopTracks();
//       if (timerRef.current) {
//         window.clearInterval(timerRef.current);
//       }
//     };
//   }, []);

//   async function loadScripts() {
//     try {
//       const res = await fetch(`${API_BASE}/scripts`);
//       if (!res.ok) throw new Error("לא ניתן לטעון תסריטים");
//       const data = await res.json();
//       setScripts(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function handleStartChat() {
//     if (!selectedScript) {
//       alert("בחרי תסריט");
//       return;
//     }

//     try {
//       setLoading(true);
//       setLastTranscript("");
//       setConversation([]);
//       setSessionId("");

//       const formData = new FormData();
//       formData.append("script_key", selectedScript);

//       const res = await fetch(`${API_BASE}/chat/start`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || "שגיאה בפתיחת שיחה");
//       }

//       const data = await res.json();
//       setSessionId(data.session_id);
//       setConversation(data.conversation || []);
//     } catch (error) {
//       console.error(error);
//       alert("שגיאה בפתיחת השיחה");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSendText() {
//     if (!sessionId) {
//       alert("צריך להתחיל שיחה קודם");
//       return;
//     }

//     const trimmed = message.trim();
//     if (!trimmed) return;

//     try {
//       setLoading(true);
//       setLastTranscript("");

//       const formData = new FormData();
//       formData.append("session_id", sessionId);
//       formData.append("message", trimmed);

//       const res = await fetch(`${API_BASE}/chat/message`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || "שגיאה בשליחת הודעה");
//       }

//       const data = await res.json();
//       setConversation(data.conversation || []);
//       setMessage("");
//     } catch (error) {
//       console.error(error);
//       alert("שגיאה בשליחת הודעה");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function startRecording() {
//     if (!sessionId) {
//       alert("צריך להתחיל שיחה קודם");
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;

//       const mimeType = getSupportedMimeType();
//       const recorder = mimeType
//         ? new MediaRecorder(stream, { mimeType })
//         : new MediaRecorder(stream);

//       audioChunksRef.current = [];

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       recorder.onstop = async () => {
//         const blobType = mimeType || "audio/webm";
//         const audioBlob = new Blob(audioChunksRef.current, { type: blobType });

//         const extension = blobType.includes("mp4")
//           ? "mp4"
//           : blobType.includes("ogg")
//           ? "ogg"
//           : "webm";

//         const audioFile = new File([audioBlob], `recording.${extension}`, {
//           type: blobType,
//         });

//         await sendRecordedAudio(audioFile);
//       };

//       mediaRecorderRef.current = recorder;
//       recorder.start();

//       setIsRecording(true);
//       setRecordingSeconds(0);

//       timerRef.current = window.setInterval(() => {
//         setRecordingSeconds((prev) => prev + 1);
//       }, 1000);
//     } catch (error) {
//       console.error(error);
//       alert("לא הצלחתי לגשת למיקרופון");
//     }
//   }

//   function stopRecording() {
//     if (!mediaRecorderRef.current) return;

//     mediaRecorderRef.current.stop();
//     setIsRecording(false);

//     if (timerRef.current) {
//       window.clearInterval(timerRef.current);
//       timerRef.current = null;
//     }

//     stopTracks();
//   }

//   function stopTracks() {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//   }

//   async function sendRecordedAudio(file: File) {
//     if (!sessionId) return;

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("session_id", sessionId);
//       formData.append("audio_file", file);

//       const res = await fetch(`${API_BASE}/chat/audio-message`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || "שגיאה בשליחת ההקלטה");
//       }

//       const data = await res.json();
//       setLastTranscript(data.transcribed_text || "");
//       setConversation(data.conversation || []);
//     } catch (error) {
//       console.error(error);
//       alert("שגיאה בשליחת ההקלטה");
//     } finally {
//       setLoading(false);
//       audioChunksRef.current = [];
//       setRecordingSeconds(0);
//     }
//   }

//   function getSupportedMimeType() {
//     const possibleTypes = [
//       "audio/webm;codecs=opus",
//       "audio/webm",
//       "audio/ogg;codecs=opus",
//       "audio/mp4",
//     ];

//     for (const type of possibleTypes) {
//       if (
//         typeof MediaRecorder !== "undefined" &&
//         MediaRecorder.isTypeSupported(type)
//       ) {
//         return type;
//       }
//     }

//     return "";
//   }

//   function formatSeconds(totalSeconds: number) {
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;

//     return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
//       2,
//       "0"
//     )}`;
//   }

//   function resetChat() {
//     if (isRecording) {
//       stopRecording();
//     }

//     setSessionId("");
//     setConversation([]);
//     setMessage("");
//     setLastTranscript("");
//     setSelectedScript("");
//     setLoading(false);
//     setRecordingSeconds(0);
//   }

//   const canSendText = useMemo(() => {
//     return !!sessionId && !!message.trim() && !loading && !isRecording;
//   }, [sessionId, message, loading, isRecording]);

//   const getStatusBadge = () => {
//     if (isRecording) {
//       return (
//         <Badge variant="destructive" className="gap-1.5">
//           <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
//           מקליט
//         </Badge>
//       );
//     }
//     if (loading) {
//       return (
//         <Badge variant="secondary" className="gap-1.5">
//           <Activity className="h-3 w-3 animate-pulse" />
//           ממתין לתגובה
//         </Badge>
//       );
//     }
//     if (sessionId) {
//       return (
//         <Badge className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90">
//           <Activity className="h-3 w-3" />
//           שיחה פעילה
//         </Badge>
//       );
//     }
//     return (
//       <Badge variant="outline" className="gap-1.5">
//         <Clock className="h-3 w-3" />
//         טרם התחילה שיחה
//       </Badge>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-background" dir="rtl">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Header Card */}
//         <Card className="mb-6 border-border shadow-sm">
//           <CardContent className="p-6">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
//                   <MessageCircle className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-foreground">
//                     סימולציית נציג שירות ביטוח
//                   </h1>
//                   <p className="mt-1 text-sm text-muted-foreground">
//                     התחילי שיחה, שלחי טקסט או הקליטי ישירות מהמיקרופון.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap items-center gap-3">
//                 <Select
//                   value={selectedScript}
//                   onValueChange={setSelectedScript}
//                   disabled={loading || !!sessionId}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="בחרי תסריט" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {scripts.map((script) => (
//                       <SelectItem key={script.key} value={script.key}>
//                         {script.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Button
//                   onClick={handleStartChat}
//                   disabled={loading || !selectedScript || !!sessionId}
//                   className="gap-2"
//                 >
//                   <Play className="h-4 w-4" />
//                   {loading && !sessionId ? "פותח שיחה..." : "התחל שיחה"}
//                 </Button>

//                 <Button variant="outline" onClick={resetChat} className="gap-2">
//                   <RefreshCw className="h-4 w-4" />
//                   שיחה חדשה
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Content Grid */}
//         <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
//           {/* Chat Area */}
//           <Card className="border-border shadow-sm">
//             <CardHeader className="border-b border-border pb-4">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <MessageCircle className="h-5 w-5 text-primary" />
//                   התכתבות
//                 </CardTitle>
//                 {getStatusBadge()}
//               </div>
//             </CardHeader>

//             <CardContent className="p-0">
//               {/* Messages Area */}
//               <ScrollArea className="h-[400px] bg-muted/30">
//                 <div className="p-4">
//                   {conversation.length === 0 ? (
//                     <div className="flex min-h-[340px] flex-col items-center justify-center gap-3 text-center">
//                       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
//                         <MessageCircle className="h-8 w-8 text-muted-foreground" />
//                       </div>
//                       <div>
//                         <p className="font-medium text-foreground">
//                           עדיין אין שיחה
//                         </p>
//                         <p className="mt-1 text-sm text-muted-foreground">
//                           {"בחרי תסריט ולחצי על \"התחל שיחה\" כדי להתחיל"}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {conversation.map((msg, index) => {
//                         const isAgent = msg.role === "user";

//                         return (
//                           <div
//                             key={`${index}-${msg.content.slice(0, 20)}`}
//                             className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
//                           >
//                             <div
//                               className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
//                                 isAgent
//                                   ? "border border-primary/20 bg-primary/5 text-foreground"
//                                   : "bg-accent text-accent-foreground"
//                               }`}
//                             >
//                               <div
//                                 className={`mb-1.5 text-xs font-semibold ${
//                                   isAgent
//                                     ? "text-primary"
//                                     : "text-accent-foreground/80"
//                                 }`}
//                               >
//                                 {isAgent ? "נציג" : "לקוח"}
//                               </div>
//                               <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                                 {msg.content}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}

//                       {loading && sessionId && (
//                         <div className="flex justify-end">
//                           <div className="max-w-[200px] rounded-2xl bg-accent px-4 py-3 text-accent-foreground shadow-sm">
//                             <div className="mb-1.5 text-xs font-semibold text-accent-foreground/80">
//                               לקוח
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm">חושב</span>
//                               <span className="flex gap-1">
//                                 <span className="h-2 w-2 animate-bounce rounded-full bg-accent-foreground [animation-delay:-0.3s]" />
//                                 <span className="h-2 w-2 animate-bounce rounded-full bg-accent-foreground [animation-delay:-0.15s]" />
//                                 <span className="h-2 w-2 animate-bounce rounded-full bg-accent-foreground" />
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       <div ref={bottomRef} />
//                     </div>
//                   )}
//                 </div>
//               </ScrollArea>

//               {/* Input Area */}
//               <div className="border-t border-border bg-card p-4">
//                 <div className="space-y-4">
//                   <Textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="כתבי כאן את תגובת הנציג..."
//                     disabled={!sessionId || loading || isRecording}
//                     className="min-h-[100px] resize-none"
//                   />

//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex flex-wrap items-center gap-2">
//                       {!isRecording ? (
//                         <Button
//                           variant="destructive"
//                           onClick={startRecording}
//                           disabled={!sessionId || loading}
//                           className="gap-2"
//                         >
//                           <Mic className="h-4 w-4" />
//                           התחל הקלטה
//                         </Button>
//                       ) : (
//                         <Button
//                           variant="destructive"
//                           onClick={stopRecording}
//                           className="gap-2 animate-pulse"
//                         >
//                           <MicOff className="h-4 w-4" />
//                           עצור ושלח
//                         </Button>
//                       )}

//                       <Button
//                         onClick={handleSendText}
//                         disabled={!canSendText}
//                         className="gap-2"
//                       >
//                         <Send className="h-4 w-4" />
//                         שלחי הודעה
//                       </Button>
//                     </div>

//                     <div className="text-sm">
//                       {isRecording ? (
//                         <Badge
//                           variant="destructive"
//                           className="gap-2 px-3 py-1.5"
//                         >
//                           <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
//                           מקליט: {formatSeconds(recordingSeconds)}
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary" className="gap-2 px-3 py-1.5">
//                           <Mic className="h-3 w-3" />
//                           אפשר להקליד או להקליט
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Session Details Card */}
//             <Card className="border-border shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-base">
//                   <Hash className="h-4 w-4 text-primary" />
//                   פרטי שיחה
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-start justify-between gap-2">
//                   <span className="text-sm font-medium text-muted-foreground">
//                     Session ID:
//                   </span>
//                   <span className="max-w-[180px] break-all text-left text-sm font-mono text-foreground">
//                     {sessionId ? sessionId.slice(0, 20) + "..." : "—"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-muted-foreground">
//                     מספר הודעות:
//                   </span>
//                   <Badge variant="secondary">{conversation.length}</Badge>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-muted-foreground">
//                     סטטוס:
//                   </span>
//                   {getStatusBadge()}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Last Transcript Card */}
//             <Card className="border-border shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-base">
//                   <FileText className="h-4 w-4 text-primary" />
//                   תמלול אחרון
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="min-h-[120px] rounded-xl bg-muted/50 p-4">
//                   <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
//                     {lastTranscript || "כאן יופיע התמלול האחרון מההקלטה."}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Color Legend Card */}
//             <Card className="border-border shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="flex items-center gap-2 text-base">
//                   <Activity className="h-4 w-4 text-primary" />
//                   הסבר צבעים
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-4 w-4 rounded border border-primary/20 bg-primary/5" />
//                   <span className="text-sm text-foreground">נציג</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="h-4 w-4 rounded bg-accent" />
//                   <span className="text-sm text-foreground">לקוח</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }