// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const SECRET_KEY = "mibs_secret_key";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "cm2434eu@@",
//   database: "mibs",
// });

// db.connect((err) => {
//   if (err) {
//     console.log("DB 연결 실패:", err);
//     return;
//   }
//   console.log("DB 연결 성공!");
// });

// // ==========================================
// // 1. 부원(MEMBER) 관리 API
// // ==========================================

// // 부원 목록 조회
// app.get("/members", (req, res) => {
//   db.query("SELECT * FROM MEMBER", (err, results) => {
//     if (err) {
//       console.error("🔴 /members 조회 에러:", err);
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(results);
//   });
// });

// // 부원 추가
// app.post("/members", (req, res) => {
//   const { name, grade, position, duty } = req.body;
//   db.query(
//     "INSERT INTO MEMBER (name, grade, position, duty) VALUES (?, ?, ?, ?)",
//     [name, grade, position, duty],
//     (err) => {
//       if (err) {
//         console.error("🔴 /members 추가 에러:", err);
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json({ success: true });
//     },
//   );
// });

// // 부원 수정
// app.put("/members/:id", (req, res) => {
//   const { name, grade, position, duty } = req.body;
//   db.query(
//     "UPDATE MEMBER SET name=?, grade=?, position=?, duty=? WHERE member_id=?",
//     [name, grade, position, duty, req.params.id],
//     (err) => {
//       if (err) {
//         console.error("🔴 /members 수정 에러:", err);
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json({ success: true });
//     },
//   );
// });

// // 부원 삭제 (ON DELETE CASCADE)
// app.delete("/members/:id", (req, res) => {
//   db.query("DELETE FROM MEMBER WHERE member_id = ?", [req.params.id], (err) => {
//     if (err) {
//       console.error("🔴 /members 삭제 에러:", err);
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ success: true });
//   });
// });

// // ==========================================
// // 2. 청소 배정(CLEANING) 관리 API
// // ==========================================

// // 청소 배정표 조회 (터미널 에러를 반영하여 완벽하게 대문자 테이블로 매칭!)
// app.get("/cleaning", (req, res) => {
//   const sql = `
//     SELECT b.broadcast_id, b.broadcast_date,
//            a.assignment_id, m.name, m.grade, a.duty
//     FROM BROADCAST b
//     LEFT JOIN ASSIGNMENT a ON b.broadcast_id = a.broadcast_id
//     LEFT JOIN MEMBER m ON a.member_id = m.member_id
//     ORDER BY b.broadcast_date DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("🔴 /cleaning 쿼리 실행 에러 발생:", err);
//       return res
//         .status(500)
//         .json({ error: "DB Query Error", details: err.message });
//     }
//     res.json(results);
//   });
// });

// // 청소 일정/방송 추가
// app.post("/broadcasts", (req, res) => {
//   const { broadcast_date, title } = req.body;
//   db.query(
//     "INSERT INTO BROADCAST (broadcast_date, title) VALUES (?, ?)",
//     [broadcast_date, title || "청소방송"],
//     (err, result) => {
//       if (err) {
//         console.error("🔴 /broadcasts 추가 에러:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       res.json({ success: true, broadcast_id: result.insertId });
//     },
//   );
// });

// // 청소 부원 배정 추가
// app.post("/assignments", (req, res) => {
//   const { broadcast_id, member_id, duty } = req.body;
//   db.query(
//     "INSERT INTO ASSIGNMENT (broadcast_id, member_id, duty) VALUES (?, ?, ?)",
//     [broadcast_id, member_id, duty],
//     (err) => {
//       if (err) {
//         console.error("🔴 /assignments 추가 에러:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       res.json({ success: true });
//     },
//   );
// });

// // 청소 배정 삭제
// app.delete("/assignments/:id", (req, res) => {
//   db.query(
//     "DELETE FROM ASSIGNMENT WHERE assignment_id = ?",
//     [req.params.id],
//     (err) => {
//       if (err) {
//         console.error("🔴 /assignments 삭제 에러:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       res.json({ success: true });
//     },
//   );
// });

// // ==========================================
// // 3. 회의록(MEETING) 관리 API
// // ==========================================

// // 회의록 목록 조회
// app.get("/meetings", (req, res) => {
//   db.query(
//     "SELECT * FROM MEETING ORDER BY meeting_date DESC",
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json(results);
//     },
//   );
// });

// // 회의록 추가
// app.post("/meetings", (req, res) => {
//   const { meeting_date, subject, content } = req.body;
//   db.query(
//     "INSERT INTO MEETING (meeting_date, subject, content) VALUES (?, ?, ?)",
//     [meeting_date, subject, content],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ success: true });
//     },
//   );
// });

// // 회의록 삭제
// app.delete("/meetings/:id", (req, res) => {
//   db.query(
//     "DELETE FROM MEETING WHERE meeting_id = ?",
//     [req.params.id],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ success: true });
//     },
//   );
// });

// // ==========================================
// // 4. 인증(AUTH) 관리 API
// // ==========================================

// // 회원가입
// app.post("/register", async (req, res) => {
//   const { username, password, name } = req.body;
//   if (!username || !password || !name)
//     return res.status(400).json({ error: "모든 항목을 입력해줘!" });
//   try {
//     const hashed = await bcrypt.hash(password, 10);
//     const today = new Date().toISOString().slice(0, 10);
//     db.query(
//       "INSERT INTO USER (username, password, name, created_at) VALUES (?, ?, ?, ?)",
//       [username, hashed, name, today],
//       (err) => {
//         if (err) {
//           if (err.code === "ER_DUP_ENTRY")
//             return res.status(400).json({ error: "이미 사용 중인 아이디야!" });
//           return res.status(500).json({ error: err.message });
//         }
//         res.json({ success: true });
//       },
//     );
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 로그인
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   db.query(
//     "SELECT * FROM USER WHERE username = ?",
//     [username],
//     async (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (results.length === 0)
//         return res.status(401).json({ error: "아이디가 존재하지 않아!" });
//       const user = results[0];
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) return res.status(401).json({ error: "비밀번호가 틀렸어!" });

//       const token = jwt.sign(
//         { id: user.user_id, username: user.username, name: user.name },
//         SECRET_KEY,
//         { expiresIn: "1h" },
//       );
//       res.json({ success: true, token, user: { name: user.name } });
//     },
//   );
// });

// // 서버 실행
// app.listen(3001, () => {
//   console.log("Server running on port 3001");
// });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mibs_secret_key";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cm2434eu@@",
  database: "mibs",
});

db.connect((err) => {
  if (err) {
    console.log("DB 연결 실패:", err);
    return;
  }
  console.log("DB 연결 성공!");
});

// ==========================================
// 1. 부원(member) 관리 API
// ==========================================

// 부원 목록 조회
app.get("/members", (req, res) => {
  db.query("SELECT * FROM member", (err, results) => {
    if (err) {
      console.error("🔴 /members 조회 에러:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 부원 추가
app.post("/members", (req, res) => {
  const { name, grade, position, duty } = req.body;
  db.query(
    "INSERT INTO member (name, grade, position, duty) VALUES (?, ?, ?, ?)",
    [name, grade, position, duty],
    (err) => {
      if (err) {
        console.error("🔴 /members 추가 에러:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 부원 수정
app.put("/members/:id", (req, res) => {
  const { name, grade, position, duty } = req.body;
  db.query(
    "UPDATE member SET name=?, grade=?, position=?, duty=? WHERE member_id=?",
    [name, grade, position, duty, req.params.id],
    (err) => {
      if (err) {
        console.error("🔴 /members 수정 에러:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 부원 삭제 (수동 연쇄 삭제로 완벽 보장)
app.delete("/members/:id", (req, res) => {
  const memberId = req.params.id;

  // 1단계: assignment 테이블에서 해당 부원 기록을 먼저 지웁니다.
  db.query("DELETE FROM assignment WHERE member_id = ?", [memberId], (err) => {
    if (err) {
      console.error("🔴 assignment 삭제 중 에러 발생:", err);
      return res.status(500).json({ error: err.message });
    }

    // 2단계: 걸림돌이 없으니 member 테이블에서 부원을 지웁니다.
    db.query("DELETE FROM member WHERE member_id = ?", [memberId], (err2) => {
      if (err2) {
        console.error("🔴 member 삭제 중 에러 발생:", err2);
        return res.status(500).json({ error: err2.message });
      }
      res.json({ success: true });
    });
  });
});

// ==========================================
// 2. 청소 배정(cleaning) 관리 API
// ==========================================

// 청소 배정표 조회 (문제였던 b.title을 삭제했습니다!)
app.get("/cleaning", (req, res) => {
  const sql = `
    SELECT b.broadcast_id, b.broadcast_date,
           a.assignment_id, m.name, m.grade, a.duty
    FROM broadcast b
    LEFT JOIN assignment a ON b.broadcast_id = a.broadcast_id
    LEFT JOIN member m ON a.member_id = m.member_id
    ORDER BY b.broadcast_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("🔴 /cleaning 쿼리 실행 에러 발생:", err);
      return res
        .status(500)
        .json({ error: "DB Query Error", details: err.message });
    }
    res.json(results);
  });
});

// 청소 일정 추가
app.post("/broadcasts", (req, res) => {
  const { broadcast_date } = req.body;
  db.query(
    "INSERT INTO broadcast (broadcast_date) VALUES (?)",
    [broadcast_date],
    (err, result) => {
      if (err) {
        console.error("🔴 /broadcasts 추가 에러:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, broadcast_id: result.insertId });
    },
  );
});

// 청소 부원 배정 추가
app.post("/assignments", (req, res) => {
  const { broadcast_id, member_id, duty } = req.body;
  db.query(
    "INSERT INTO assignment (broadcast_id, member_id, duty) VALUES (?, ?, ?)",
    [broadcast_id, member_id, duty],
    (err) => {
      if (err) {
        console.error("🔴 /assignments 추가 에러:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    },
  );
});

// 청소 배정 삭제 (마지막 멤버 삭제 시 broadcast도 자동 삭제)
app.delete("/assignments/:id", (req, res) => {
  // 1단계: 삭제 전에 broadcast_id 먼저 조회
  db.query(
    "SELECT broadcast_id FROM assignment WHERE assignment_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.status(404).json({ error: "없는 배정이야" });

      const broadcastId = rows[0].broadcast_id;

      // 2단계: assignment 삭제
      db.query(
        "DELETE FROM assignment WHERE assignment_id = ?",
        [req.params.id],
        (err) => {
          if (err) {
            console.error("🔴 /assignments 삭제 에러:", err);
            return res.status(500).json({ error: err.message });
          }

          // 3단계: 해당 broadcast에 남은 assignment 수 확인
          db.query(
            "SELECT COUNT(*) AS cnt FROM assignment WHERE broadcast_id = ?",
            [broadcastId],
            (err, countRows) => {
              if (err) return res.status(500).json({ error: err.message });

              if (countRows[0].cnt === 0) {
                // 4단계: 아무도 없으면 broadcast도 삭제
                db.query(
                  "DELETE FROM broadcast WHERE broadcast_id = ?",
                  [broadcastId],
                  (err) => {
                    if (err)
                      return res.status(500).json({ error: err.message });
                    res.json({ success: true, broadcastDeleted: true });
                  },
                );
              } else {
                res.json({ success: true, broadcastDeleted: false });
              }
            },
          );
        },
      );
    },
  );
});

// ==========================================
// 3. 회의록(meeting) 관리 API
// ==========================================

app.get("/meetings", (req, res) => {
  db.query(
    "SELECT * FROM meeting ORDER BY meeting_date DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    },
  );
});

app.post("/meetings", (req, res) => {
  const { meeting_date, subject, content } = req.body;
  db.query(
    "INSERT INTO meeting (meeting_date, subject, content) VALUES (?, ?, ?)",
    [meeting_date, subject, content],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

app.delete("/meetings/:id", (req, res) => {
  db.query(
    "DELETE FROM meeting WHERE meeting_id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    },
  );
});

// ==========================================
// 4. 인증(auth) 관리 API
// ==========================================

app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name)
    return res.status(400).json({ error: "모든 항목을 입력해줘!" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const today = new Date().toISOString().slice(0, 10);
    db.query(
      "INSERT INTO user (username, password, name, created_at) VALUES (?, ?, ?, ?)",
      [username, hashed, name, today],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY")
            return res.status(400).json({ error: "이미 사용 중인 아이디야!" });
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true });
      },
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(401).json({ error: "아이디가 존재하지 않아!" });
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "비밀번호가 틀렸어!" });

      const token = jwt.sign(
        { id: user.user_id, username: user.username, name: user.name },
        SECRET_KEY,
        { expiresIn: "1h" },
      );
      res.json({ success: true, token, user: { name: user.name } });
    },
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
