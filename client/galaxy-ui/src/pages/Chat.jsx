import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function Chat() {
  const { galaxyId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  // 🔥 SAFE USER PARSE (no crash)
  const storedUser = localStorage.getItem("user");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const myId = user?._id ? String(user._id) : "";

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

  // 🔥 SAFE FETCH
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `https://galaxyverse.onrender.com/api/messages/${galaxyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Invalid messages:", data);
        setMessages([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages([]);
    }
  };

  // 🔥 POLLING
  useEffect(() => {
    if (!galaxyId) return;

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [galaxyId]);

  // 🔽 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
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
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  // 🔥 SAFETY UI
  if (!token) return <div>Please login again</div>;
  if (!galaxyId) return <div>Loading...</div>;

  return (
    <div className="chat-container">
      <h3 style={{ textAlign: "center" }}>💬 Chat with {galaxyId}</h3>

      <div className="chat-messages">
        {Array.isArray(messages) &&
          messages.map((m, index) => {
            const senderId = normalizeSenderId(m.sender);
            const isMe = senderId === myId;

            const currentDate = new Date(m.createdAt).toDateString();
            const previousDate =
              index > 0
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null;
            const showDate = currentDate !== previousDate;

            return (
              <div key={m._id}>
                {showDate && (
                  <div className="chat-date">
                    {formatDate(m.createdAt)}
                  </div>
                )}

                <div className={`chat-row ${isMe ? "me" : "other"}`}>
                  <div
                    className={`chat-bubble ${
                      isMe ? "chat-me" : "chat-other"
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className="chat-time">
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>🚀</button>
      </div>
    </div>
  );
}

export default Chat;