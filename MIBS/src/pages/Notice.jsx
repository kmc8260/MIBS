import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    created_at: "",
    is_pinned: false,
  });

  const fetchData = () => {
    fetch("http://localhost:3001/notices")
      .then((res) => res.json())
      .then(setNotices);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!form.title || !form.author || !form.created_at)
      return alert("제목, 작성자, 날짜를 입력해줘!");
    await fetch("http://localhost:3001/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchData();
    setShowForm(false);
    setForm({
      title: "",
      content: "",
      author: "",
      created_at: "",
      is_pinned: false,
    });
  };

  const handlePin = async (notice) => {
    await fetch(`http://localhost:3001/notices/${notice.notice_id}/pin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_pinned: !notice.is_pinned }),
    });
    fetchData();
    if (selected) setSelected({ ...selected, is_pinned: !selected.is_pinned });
  };

  const handleDelete = (id) => {
    if (!window.confirm("삭제할까?")) return;
    fetch(`http://localhost:3001/notices/${id}`, { method: "DELETE" }).then(
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
              공지사항
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>
              총 {notices.length}건
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
            + 공지 추가
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
              새 공지 추가
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    제목
                  </p>
                  <input
                    type="text"
                    placeholder="공지 제목 입력"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
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
                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    작성자
                  </p>
                  <input
                    type="text"
                    placeholder="이름"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  />
                </div>
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
                    value={form.created_at}
                    onChange={(e) =>
                      setForm({ ...form, created_at: e.target.value })
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontSize: "13px",
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
                  placeholder="공지 내용 입력"
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  id="pinned"
                  checked={form.is_pinned}
                  onChange={(e) =>
                    setForm({ ...form, is_pinned: e.target.checked })
                  }
                />
                <label
                  htmlFor="pinned"
                  style={{ fontSize: "13px", color: "#666", cursor: "pointer" }}
                >
                  📌 고정글로 등록
                </label>
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
          {notices.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#ccc",
                fontSize: "14px",
              }}
            >
              공지사항이 없어요
            </div>
          ) : (
            notices.map((n) => (
              <div
                key={n.notice_id}
                onClick={() => setSelected(n)}
                style={{
                  background: "#fff",
                  border: `1px solid ${n.is_pinned ? "#2E4057" : "#ebebeb"}`,
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
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    {n.is_pinned && (
                      <span style={{ fontSize: "12px" }}>📌</span>
                    )}
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "15px",
                        color: "#1a1a1a",
                      }}
                    >
                      {n.title}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
                    {n.author} ·{" "}
                    {new Date(n.created_at).toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {selected.is_pinned && <span>📌</span>}
                  <span style={{ fontSize: "12px", color: "#aaa" }}>
                    {selected.author} ·{" "}
                    {new Date(selected.created_at).toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                  }}
                >
                  {selected.title}
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
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => handlePin(selected)}
                style={{
                  background: selected.is_pinned ? "#2E4057" : "none",
                  color: selected.is_pinned ? "#fff" : "#666",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {selected.is_pinned ? "📌 고정 해제" : "📌 고정"}
              </button>
              <button
                onClick={() => handleDelete(selected.notice_id)}
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

export default Notice;
