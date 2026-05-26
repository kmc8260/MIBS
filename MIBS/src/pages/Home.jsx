import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3001/members")
      .then((res) => res.json())
      .then((data) => setMemberCount(data.length))
      .catch((err) => console.log("에러:", err));
  }, []);

  const menus = [
    {
      label: "부원 목록",
      sub: `총 ${memberCount}명`,
      path: "/members",
      icon: "👥",
      bg: "#E6F1FB",
    },
    {
      label: "공지사항",
      sub: "방송부 공지",
      path: "/notice",
      icon: "📢",
      bg: "#FAECE7",
    },
    {
      label: "청소 배정표",
      sub: "수요일 청소",
      path: "/cleaning",
      icon: "🧹",
      bg: "#FAEEDA",
    },
    {
      label: "회의 기록",
      sub: "회의 아카이브",
      path: "/meeting",
      icon: "📝",
      bg: "#FAECE7",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            background: "#2E4057",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "26px",
          }}
        >
          🎙️
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "#1a1a1a",
          }}
        >
          MIBS 방송부
        </h1>
        <p style={{ margin: "6px 0 0", color: "#999", fontSize: "13px" }}>
          미림마이스터고등학교
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
          width: "100%",
          maxWidth: "500px",
          padding: "0 2rem",
        }}
      >
        {menus.map((menu) => (
          <div
            key={menu.path}
            onClick={() => navigate(menu.path)}
            style={{
              background: "#fff",
              border: "1px solid #ebebeb",
              borderRadius: "16px",
              padding: "1.5rem",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: menu.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                marginBottom: "14px",
              }}
            >
              {menu.icon}
            </div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "15px",
                color: "#1a1a1a",
              }}
            >
              {menu.label}
            </p>
            <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#aaa" }}>
              {menu.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
