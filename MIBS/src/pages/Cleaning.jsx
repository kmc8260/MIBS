// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const dutyColor = {
//   대걸레: { bg: "#E6F1FB", text: "#0C447C" },
//   쓰레기통: { bg: "#EEEDFE", text: "#3C3489" },
//   빗자루: { bg: "#EAF3DE", text: "#27500A" },
//   물티슈: { bg: "#FAEEDA", text: "#633806" },
// };

// function Cleaning() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     newDate: "",
//     member_id: "",
//     duty: "대걸레",
//   });

//   const fetchData = () => {
//     fetch("http://localhost:3001/cleaning")
//       .then((res) => res.json())
//       .then((raw) => {
//         // [추가] 만약 서버에서 에러 객체(error)를 보냈다면 경고창으로 진짜 원인을 띄워줍니다.
//         if (raw && raw.error) {
//           alert(`🚨 DB 조회 에러 발생!\n원인: ${raw.details || raw.error}`);
//           console.error("서버 전달 에러 내용:", raw);
//           return;
//         }

//         // 정상 배열 데이터일 때만 아래 로직을 수행하도록 보호막을 칩니다.
//         if (!Array.isArray(raw)) {
//           console.error("서버가 배열이 아닌 데이터를 보냈습니다:", raw);
//           return;
//         }

//         const grouped = {};
//         raw.forEach((row) => {
//           const key = row.broadcast_id;
//           if (!grouped[key]) {
//             grouped[key] = {
//               broadcast_id: row.broadcast_id,
//               date: row.broadcast_date,
//               members: [],
//             };
//           }
//           if (row.assignment_id) {
//             grouped[key].members.push({
//               assignment_id: row.assignment_id,
//               name: row.name,
//               grade: row.grade,
//               duty: row.duty,
//             });
//           }
//         });
//         setData(Object.values(grouped));
//       })
//       .catch((err) => console.error("네트워크 에러:", err));
//   };

//   useEffect(() => {
//     fetchData();
//     fetch("http://localhost:3001/members")
//       .then((res) => res.json())
//       .then(setMembers);
//   }, []);

//   const handleAdd = async () => {
//     if (!form.newDate || !form.member_id)
//       return alert("날짜와 부원을 선택해줘!");

//     let broadcastId = data.find(
//       (b) => b.date.slice(0, 10) === form.newDate,
//     )?.broadcast_id;

//     if (!broadcastId) {
//       const res = await fetch("http://localhost:3001/broadcast", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ broadcast_date: form.newDate }),
//       });
//       const result = await res.json();
//       broadcastId = result.broadcast_id;
//     }

//     await fetch("http://localhost:3001/cleaning", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         broadcast_id: broadcastId,
//         member_id: form.member_id,
//         duty: form.duty,
//       }),
//     });

//     fetchData();
//     setShowForm(false);
//     setForm({ newDate: "", member_id: "", duty: "대걸레" });
//   };

//   const handleDelete = (assignment_id) => {
//     if (!window.confirm("삭제할까?")) return;
//     fetch(`http://localhost:3001/cleaning/${assignment_id}`, {
//       method: "DELETE",
//     }).then(() => fetchData());
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#f7f7f5", padding: "2rem" }}>
//       <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
//         <button
//           onClick={() => navigate("/")}
//           style={{
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "14px",
//             color: "#888",
//             marginBottom: "1.5rem",
//             padding: 0,
//             display: "block",
//           }}
//         >
//           ← 메인으로
//         </button>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             marginBottom: "1.5rem",
//           }}
//         >
//           <div>
//             <h1
//               style={{
//                 margin: "0 0 4px",
//                 fontSize: "24px",
//                 fontWeight: 600,
//                 color: "#1a1a1a",
//               }}
//             >
//               청소 배정표
//             </h1>
//             <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>
//               매주 수요일 방송실 청소
//             </p>
//           </div>
//           <button
//             onClick={() => setShowForm(!showForm)}
//             style={{
//               background: "#2E4057",
//               color: "#fff",
//               border: "none",
//               borderRadius: "10px",
//               padding: "8px 16px",
//               fontSize: "13px",
//               cursor: "pointer",
//             }}
//           >
//             + 배정 추가
//           </button>
//         </div>

//         {showForm && (
//           <div
//             style={{
//               background: "#fff",
//               border: "1px solid #ebebeb",
//               borderRadius: "16px",
//               padding: "1.5rem",
//               marginBottom: "1.5rem",
//             }}
//           >
//             <p
//               style={{ margin: "0 0 1rem", fontWeight: 600, fontSize: "15px" }}
//             >
//               새 배정 추가
//             </p>
//             <div
//               style={{
//                 display: "flex",
//                 gap: "10px",
//                 flexWrap: "wrap",
//                 alignItems: "flex-end",
//               }}
//             >
//               <div>
//                 <p
//                   style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
//                 >
//                   날짜
//                 </p>
//                 <input
//                   type="date"
//                   value={form.newDate}
//                   onChange={(e) =>
//                     setForm({ ...form, newDate: e.target.value })
//                   }
//                   style={{
//                     padding: "8px 12px",
//                     borderRadius: "8px",
//                     border: "1px solid #e0e0e0",
//                     fontSize: "13px",
//                   }}
//                 />
//               </div>
//               <div>
//                 <p
//                   style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
//                 >
//                   부원
//                 </p>
//                 <select
//                   value={form.member_id}
//                   onChange={(e) =>
//                     setForm({ ...form, member_id: e.target.value })
//                   }
//                   style={{
//                     padding: "8px 12px",
//                     borderRadius: "8px",
//                     border: "1px solid #e0e0e0",
//                     fontSize: "13px",
//                   }}
//                 >
//                   <option value="">선택</option>
//                   {members.map((m) => (
//                     <option key={m.member_id} value={m.member_id}>
//                       {m.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <p
//                   style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}
//                 >
//                   역할
//                 </p>
//                 <select
//                   value={form.duty}
//                   onChange={(e) => setForm({ ...form, duty: e.target.value })}
//                   style={{
//                     padding: "8px 12px",
//                     borderRadius: "8px",
//                     border: "1px solid #e0e0e0",
//                     fontSize: "13px",
//                   }}
//                 >
//                   <option>대걸레</option>
//                   <option>쓰레기통</option>
//                   <option>빗자루</option>
//                   <option>물티슈</option>
//                 </select>
//               </div>
//               <button
//                 onClick={handleAdd}
//                 style={{
//                   background: "#2E4057",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "8px 16px",
//                   fontSize: "13px",
//                   cursor: "pointer",
//                 }}
//               >
//                 추가
//               </button>
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   background: "none",
//                   border: "1px solid #e0e0e0",
//                   borderRadius: "8px",
//                   padding: "8px 16px",
//                   fontSize: "13px",
//                   cursor: "pointer",
//                   color: "#888",
//                 }}
//               >
//                 취소
//               </button>
//             </div>
//           </div>
//         )}

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(2, 1fr)",
//             gap: "16px",
//           }}
//         >
//           {data.map((broadcast) => (
//             <div
//               key={broadcast.broadcast_id}
//               style={{
//                 background: "#fff",
//                 border: "1px solid #ebebeb",
//                 borderRadius: "16px",
//                 padding: "1.5rem",
//               }}
//             >
//               <div
//                 style={{
//                   marginBottom: "1rem",
//                   paddingBottom: "1rem",
//                   borderBottom: "1px solid #f5f5f5",
//                 }}
//               >
//                 <p
//                   style={{
//                     margin: 0,
//                     fontWeight: 600,
//                     fontSize: "16px",
//                     color: "#1a1a1a",
//                   }}
//                 >
//                   {new Date(broadcast.date).toLocaleDateString("ko-KR", {
//                     month: "long",
//                     day: "numeric",
//                     weekday: "short",
//                   })}
//                 </p>
//                 <p
//                   style={{ margin: "4px 0 0", fontSize: "12px", color: "#aaa" }}
//                 >
//                   방송실 청소
//                 </p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "10px",
//                 }}
//               >
//                 {broadcast.members.map((m, i) => {
//                   const dc = dutyColor[m.duty] || {
//                     bg: "#f5f5f5",
//                     text: "#666",
//                   };
//                   return (
//                     <div
//                       key={i}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: 32,
//                             height: 32,
//                             borderRadius: "50%",
//                             background: dc.bg,
//                             color: dc.text,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "12px",
//                             fontWeight: 600,
//                           }}
//                         >
//                           {m.name.slice(0, 2)}
//                         </div>
//                         <div>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: "14px",
//                               fontWeight: 500,
//                               color: "#1a1a1a",
//                             }}
//                           >
//                             {m.name}
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: "12px",
//                               color: "#aaa",
//                             }}
//                           >
//                             {m.grade}학년
//                           </p>
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontSize: "12px",
//                             padding: "4px 10px",
//                             borderRadius: "20px",
//                             background: dc.bg,
//                             color: dc.text,
//                             fontWeight: 500,
//                           }}
//                         >
//                           {m.duty}
//                         </span>
//                         <button
//                           onClick={() => handleDelete(m.assignment_id)}
//                           style={{
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             fontSize: "16px",
//                             color: "#ccc",
//                             padding: "0 4px",
//                           }}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cleaning;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const dutyColor = {
  대걸레: { bg: "#E6F1FB", text: "#0C447C" },
  쓰레기통: { bg: "#EEEDFE", text: "#3C3489" },
  빗자루: { bg: "#EAF3DE", text: "#27500A" },
  물티슈: { bg: "#FAEEDA", text: "#633806" },
};

function Cleaning() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [rows, setRows] = useState([{ member_id: "", duty: "대걸레" }]);

  const fetchData = () => {
    fetch("http://localhost:3001/cleaning")
      .then((res) => res.json())
      .then((raw) => {
        // [추가] 만약 서버에서 에러 객체(error)를 보냈다면 경고창으로 진짜 원인을 띄워줍니다.
        if (raw && raw.error) {
          alert(`🚨 DB 조회 에러 발생!\n원인: ${raw.details || raw.error}`);
          console.error("서버 전달 에러 내용:", raw);
          return;
        }

        // 정상 배열 데이터일 때만 아래 로직을 수행하도록 보호막을 칩니다.
        if (!Array.isArray(raw)) {
          console.error("서버가 배열이 아닌 데이터를 보냈습니다:", raw);
          return;
        }

        const grouped = {};
        raw.forEach((row) => {
          const key = row.broadcast_id;
          if (!grouped[key]) {
            grouped[key] = {
              broadcast_id: row.broadcast_id,
              date: row.broadcast_date,
              members: [],
            };
          }
          if (row.assignment_id) {
            grouped[key].members.push({
              assignment_id: row.assignment_id,
              name: row.name,
              grade: row.grade,
              duty: row.duty,
            });
          }
        });
        setData(Object.values(grouped));
      })
      .catch((err) => console.error("네트워크 에러:", err));
  };

  useEffect(() => {
    fetchData();
    fetch("http://localhost:3001/members")
      .then((res) => res.json())
      .then(setMembers);
  }, []);

  const addRow = () => {
    setRows([...rows, { member_id: "", duty: "대걸레" }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleAdd = async () => {
    if (!newDate) return alert("날짜를 선택해줘!");
    if (rows.some((r) => !r.member_id)) return alert("부원을 모두 선택해줘!");

    let broadcastId = data.find(
      (b) => b.date.slice(0, 10) === newDate,
    )?.broadcast_id;

    if (!broadcastId) {
      const res = await fetch("http://localhost:3001/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broadcast_date: newDate }),
      });
      const result = await res.json();
      broadcastId = result.broadcast_id;
    }

    for (const row of rows) {
      await fetch("http://localhost:3001/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          broadcast_id: broadcastId,
          member_id: row.member_id,
          duty: row.duty,
        }),
      });
    }

    fetchData();
    setShowForm(false);
    setNewDate("");
    setRows([{ member_id: "", duty: "대걸레" }]);
  };

  const handleDelete = (assignment_id) => {
    if (!window.confirm("삭제할까?")) return;

    fetch(`http://localhost:3001/assignments/${assignment_id}`, {
      method: "DELETE",
    }).then(() => fetchData());
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
              청소 배정표
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#aaa" }}>
              매주 수요일 방송실 청소
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
            + 배정 추가
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
              새 배정 추가
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#aaa" }}>
                날짜
              </p>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  fontSize: "13px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "1rem",
              }}
            >
              {rows.map((row, index) => (
                <div
                  key={index}
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <select
                    value={row.member_id}
                    onChange={(e) =>
                      updateRow(index, "member_id", e.target.value)
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  >
                    <option value="">부원 선택</option>
                    {members.map((m) => (
                      <option key={m.member_id} value={m.member_id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={row.duty}
                    onChange={(e) => updateRow(index, "duty", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontSize: "13px",
                    }}
                  >
                    <option>대걸레</option>
                    <option>쓰레기통</option>
                    <option>빗자루</option>
                    <option>물티슈</option>
                  </select>
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(index)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#ccc",
                        padding: "0 4px",
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              style={{
                background: "none",
                border: "1px dashed #ccc",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "13px",
                cursor: "pointer",
                color: "#aaa",
                marginBottom: "1rem",
                display: "block",
              }}
            >
              + 부원 추가
            </button>

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
                저장
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewDate("");
                  setRows([{ member_id: "", duty: "대걸레" }]);
                }}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          {data
            .filter((broadcast) => broadcast.members.length > 0) // ← 이거 추가
            .map((broadcast) => (
              <div
                key={broadcast.broadcast_id}
                style={{
                  background: "#fff",
                  border: "1px solid #ebebeb",
                  borderRadius: "16px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#1a1a1a",
                    }}
                  >
                    {new Date(broadcast.date).toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12px",
                      color: "#aaa",
                    }}
                  >
                    방송실 청소
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {broadcast.members.map((m, i) => {
                    const dc = dutyColor[m.duty] || {
                      bg: "#f5f5f5",
                      text: "#666",
                    };
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: dc.bg,
                              color: dc.text,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {m.name.slice(0, 2)}
                          </div>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#1a1a1a",
                              }}
                            >
                              {m.name}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12px",
                                color: "#aaa",
                              }}
                            >
                              {m.grade}학년
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
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
                          <button
                            onClick={() => handleDelete(m.assignment_id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "16px",
                              color: "#ccc",
                              padding: "0 4px",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Cleaning;
