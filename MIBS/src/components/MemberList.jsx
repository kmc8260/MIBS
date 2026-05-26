import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const dutyColor = {
  아나운서: { bg: "#E6F1FB", text: "#0C447C" },
  PD: { bg: "#EEEDFE", text: "#3C3489" },
  엔지니어: { bg: "#EAF3DE", text: "#27500A" },
};

const avatarColors = [
  { bg: "#E6F1FB", text: "#0C447C" },
  { bg: "#EEEDFE", text: "#3C3489" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAEEDA", text: "#633806" },
  { bg: "#FAECE7", text: "#712B13" },
];

const positions = ["부장", "차장", "대리", "오락부장", "미화부장"];

function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [dutyFilter, setDutyFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({
    name: "",
    grade: "1",
    position: "",
    duty: "엔지니어",
  });

  const fetchData = () => {
    fetch("http://localhost:3001/members")
      .then((res) => res.json())
      .then(setMembers);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = members.filter(
    (m) =>
      (gradeFilter === "all" || m.grade === Number(gradeFilter)) &&
      (dutyFilter === "all" || m.duty === dutyFilter),
  );

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: "", grade: "1", position: "", duty: "엔지니어" });
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditTarget(m);
    setForm({
      name: m.name,
      grade: String(m.grade),
      position: m.position || "",
      duty: m.duty,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name) return alert("이름을 입력해줘!");
    const body = { ...form, position: form.position || null };
    if (editTarget) {
      await fetch(`http://localhost:3001/members/${editTarget.member_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("http://localhost:3001/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    fetchData();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("삭제할까?")) return;
    fetch(`http://localhost:3001/members/${id}`, { method: "DELETE" }).then(
      () => fetchData(),
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
              부원 목록
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>
              총 {filtered.length}명
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              style={{
                fontSize: "13px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                background: "#fff",
                color: "#333",
                cursor: "pointer",
              }}
            >
              <option value="all">전체 학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
            </select>
            <select
              value={dutyFilter}
              onChange={(e) => setDutyFilter(e.target.value)}
              style={{
                fontSize: "13px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                background: "#fff",
                color: "#333",
                cursor: "pointer",
              }}
            >
              <option value="all">전체 역할</option>
              <option value="아나운서">아나운서</option>
              <option value="PD">PD</option>
              <option value="엔지니어">엔지니어</option>
            </select>
            <button
              onClick={openAdd}
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
              + 부원 추가
            </button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { label: "전체 부원", value: `${members.length}명` },
            {
              label: "1학년",
              value: `${members.filter((m) => m.grade === 1).length}명`,
            },
            {
              label: "2학년",
              value: `${members.filter((m) => m.grade === 2).length}명`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                border: "1px solid #ebebeb",
              }}
            >
              <p style={{ margin: 0, fontSize: "12px", color: "#aaa" }}>
                {stat.label}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* 추가/수정 폼 */}
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
              {editTarget ? "부원 수정" : "새 부원 추가"}
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p
                  style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
                >
                  이름
                </p>
                <input
                  type="text"
                  placeholder="이름"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
                >
                  학년
                </p>
                <select
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "13px",
                  }}
                >
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                </select>
              </div>
              <div>
                <p
                  style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
                >
                  직책 (2학년만)
                </p>
                <select
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "13px",
                  }}
                >
                  <option value="">없음</option>
                  {positions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p
                  style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
                >
                  역할
                </p>
                <select
                  value={form.duty}
                  onChange={(e) => setForm({ ...form, duty: e.target.value })}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "13px",
                  }}
                >
                  <option>아나운서</option>
                  <option>PD</option>
                  <option>엔지니어</option>
                </select>
              </div>
              <button
                onClick={handleSubmit}
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
                {editTarget ? "수정" : "추가"}
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
        )}

        {/* 카드 그리드 */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "#ccc",
              fontSize: "14px",
            }}
          >
            해당하는 부원이 없어요
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            {filtered.map((m) => {
              const av = avatarColors[(m.member_id - 1) % avatarColors.length];
              const dc = dutyColor[m.duty] || { bg: "#f5f5f5", text: "#666" };
              return (
                <div
                  key={m.member_id}
                  style={{
                    background: "#fff",
                    border: "1px solid #ebebeb",
                    borderRadius: "16px",
                    padding: "1.25rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.07)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: av.bg,
                        color: av.text,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 600,
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {m.name.slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: "15px",
                          color: "#1a1a1a",
                        }}
                      >
                        {m.name}
                      </p>
                      <p
                        style={{
                          margin: "3px 0 0",
                          fontSize: "12px",
                          color: "#aaa",
                        }}
                      >
                        {m.grade}학년{m.position ? ` · ${m.position}` : ""}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => openEdit(m)}
                        style={{
                          background: "none",
                          border: "1px solid #e0e0e0",
                          borderRadius: "6px",
                          padding: "3px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                          color: "#666",
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(m.member_id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#ccc",
                          padding: "0 2px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #f5f5f5",
                      paddingTop: "12px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: dc.bg,
                        color: dc.text,
                        fontWeight: 500,
                      }}
                    >
                      {m.duty}
                    </span>
                    {m.position && (
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          background: "#f5f5f5",
                          color: "#666",
                        }}
                      >
                        {m.position}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberList;
