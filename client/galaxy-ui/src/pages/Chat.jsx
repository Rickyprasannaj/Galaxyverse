import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function Chat() {
  const { galaxyId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const myId = String(user._id);

  const bottomRef = useRef(null);

  const normalizeSenderId = (sender) => {
    if (!sender) return "";
    if (typeof sender === "string") return sender;
    if (typeof sender === "object" && sender._id) return String(sender._id);
    return "";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const fetchMessages = async () => {
    const res = await fetch(`https://galaxyverse.onrender.com/api/messages/${galaxyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, [galaxyId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("https://galaxyverse.onrender.com/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ galaxyId, text }),
    });

    setText("");
    fetchMessages();
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h3>💬 Chat with {galaxyId}</h3>

      <div
        style={{
          minHeight: "60vh",
          padding: "15px",
          borderRadius: "16px",
          border: "2px solid black",
          background: "rgba(0,0,0,0.45)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          width: "100%", // ✅ ensure chat container spans full width
        }}
      >
        {messages.map((m, index) => {
          const senderId = normalizeSenderId(m.sender);
          const isMe = senderId === myId;

          const currentDate = new Date(m.createdAt).toDateString();
          const previousDate =
            index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const showDate = currentDate !== previousDate;

          return (
            <div key={m._id}>
              {showDate && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "16px 0 8px",
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  {formatDate(m.createdAt)}
                </div>
              )}

              {/* ✅ Wrapper spans full width */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                {/* ✅ Bubble */}
                <div
                  style={{
                    background: isMe ? "#00a0f2" : "#1f1f1f",
                    color: "white",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "65%",
                    boxShadow: isMe
                      ? "0 0 10px rgba(0,160,242,0.6)"
                      : "0 0 6px rgba(255,255,255,0.15)",
                  }}
                >
                  <div>{m.text}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.6,
                      marginTop: "4px",
                      textAlign: "right",
                    }}
                  >
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{ marginTop: "15px", display: "flex" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "14px",
            border: "2px solid black",
          }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
          🚀
        </button>
      </div>
    </div>
  );
}

export default Chat;
