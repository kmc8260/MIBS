import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Meeting() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    meeting_date: "",
    subject: "",
    content: "",
  });

  const fetchData = () => {
    fetch("http://localhost:3001/meetings")
      .then((res) => res.json())
      .then(setMeetings);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!form.meeting_date || !form.subject)
      return alert("날짜와 주제를 입력해줘!");
    await fetch("http://localhost:3001/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchData();
    setShowForm(false);
    setForm({ meeting_date: "", subject: "", content: "" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("삭제할까?")) return;
    fetch(`http://localhost:3001/meetings/${id}`, { method: "DELETE" }).then(
      () => {
        fetchData();
        setSelected(null);
      },
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", padding: "2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            color: "#888",
            marginBottom: "1.5rem",
            padding: 0,
            display: "block",
          }}
        >
          ← 메인으로
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 4px",
                fontSize: "24px",
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              회의 기록
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>
              총 {meetings.length}건
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: "#2E4057",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            + 회의 추가
          </button>
        </div>

        {showForm && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ebebeb",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <p
              style={{ margin: "0 0 1rem", fontWeight: 600, fontSize: "15px" }}
            >
              새 회의 추가
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    날짜
                  </p>
                  <input
                    type="date"
                    value={form.meeting_date}
                    onChange={(e) =>
                      setForm({ ...form, meeting_date: e.target.value })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    주제
                  </p>
                  <input
                    type="text"
                    placeholder="회의 주제 입력"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontSize: "13px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <div>
                <p
                  style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
                >
                  내용
                </p>
                <textarea
                  placeholder="회의 내용 입력"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  rows={4}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "13px",
                    width: "100%",
                    resize: "vertical",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleAdd}
                  style={{
                    background: "#2E4057",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  추가
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: "none",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {meetings.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#ccc",
                fontSize: "14px",
              }}
            >
              회의 기록이 없어요
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.meeting_id}
                onClick={() => setSelected(m)}
                style={{
                  background: "#fff",
                  border: "1px solid #ebebeb",
                  borderRadius: "16px",
                  padding: "1.25rem 1.5rem",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.07)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "#E6F1FB",
                        color: "#0C447C",
                        fontWeight: 500,
                      }}
                    >
                      {new Date(m.meeting_date).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "15px",
                        color: "#1a1a1a",
                      }}
                    >
                      {m.subject}
                    </p>
                  </div>
                  {m.content && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#aaa",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "600px",
                      }}
                    >
                      {m.content}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: "18px", color: "#ccc" }}>›</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 모달 */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "2rem",
              width: "500px",
              maxWidth: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "#E6F1FB",
                    color: "#0C447C",
                    fontWeight: 500,
                  }}
                >
                  {new Date(selected.meeting_date).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
                <h2
                  style={{
                    margin: "10px 0 0",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                  }}
                >
                  {selected.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#aaa",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{ borderTop: "1px solid #f5f5f5", paddingTop: "1.5rem" }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#444",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selected.content || "내용 없음"}
              </p>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1rem",
                borderTop: "1px solid #f5f5f5",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => handleDelete(selected.meeting_id)}
                style={{
                  background: "none",
                  border: "1px solid #ffcccc",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  cursor: "pointer",
                  color: "#e05555",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Meeting;
