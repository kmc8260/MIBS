const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

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

// 부원 목록 조회
app.get("/members", (req, res) => {
  db.query("SELECT * FROM MEMBER", (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json(results);
  });
});

app.get("/cleaning", (req, res) => {
  const sql = `
    SELECT b.broadcast_id, b.broadcast_date, b.title,
       a.assignment_id, m.name, m.grade, a.duty
    FROM BROADCAST b
    JOIN ASSIGNMENT a ON b.broadcast_id = a.broadcast_id
    JOIN MEMBER m ON a.member_id = m.member_id
    WHERE b.category = '방송실청소'
    ORDER BY b.broadcast_date, a.duty
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json(results);
  });
});

// 부원 추가
app.post("/members", (req, res) => {
  const { name, grade, position, duty } = req.body;
  db.query(
    "INSERT INTO MEMBER (name, grade, position, duty) VALUES (?, ?, ?, ?)",
    [name, grade, position || null, duty],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
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
    "UPDATE MEMBER SET name=?, grade=?, position=?, duty=? WHERE member_id=?",
    [name, grade, position || null, duty, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 부원 삭제
app.delete("/members/:id", (req, res) => {
  db.query("DELETE FROM MEMBER WHERE member_id=?", [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json({ success: true });
  });
});

// 청소 배정 추가
app.post("/cleaning", (req, res) => {
  const { broadcast_id, member_id, duty } = req.body;
  db.query(
    "INSERT INTO ASSIGNMENT (broadcast_id, member_id, duty) VALUES (?, ?, ?)",
    [broadcast_id, member_id, duty],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 청소 배정 삭제
app.delete("/cleaning/:id", (req, res) => {
  db.query(
    "DELETE FROM ASSIGNMENT WHERE assignment_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 청소 일정 추가
app.post("/broadcast", (req, res) => {
  const { broadcast_date } = req.body;
  db.query(
    "INSERT INTO BROADCAST (title, broadcast_date, category, is_recurring, notes) VALUES (?, ?, ?, ?, ?)",
    ["방송실 청소", broadcast_date, "방송실청소", true, "매주 수요일"],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true, broadcast_id: result.insertId });
    },
  );
});

// 회의 목록 조회
app.get("/meetings", (req, res) => {
  db.query(
    "SELECT * FROM MEETING ORDER BY meeting_date DESC",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json(results);
    },
  );
});

// 회의 추가
app.post("/meetings", (req, res) => {
  const { meeting_date, subject, content } = req.body;
  db.query(
    "INSERT INTO MEETING (meeting_date, subject, content) VALUES (?, ?, ?)",
    [meeting_date, subject, content],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 회의 삭제
app.delete("/meetings/:id", (req, res) => {
  db.query(
    "DELETE FROM MEETING WHERE meeting_id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 공지사항 조회 (고정글 먼저)
app.get("/notices", (req, res) => {
  db.query(
    "SELECT * FROM NOTICE ORDER BY is_pinned DESC, created_at DESC",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json(results);
    },
  );
});

// 공지사항 추가
app.post("/notices", (req, res) => {
  const { title, content, author, created_at, is_pinned } = req.body;
  db.query(
    "INSERT INTO NOTICE (title, content, author, created_at, is_pinned) VALUES (?, ?, ?, ?, ?)",
    [title, content, author, created_at, is_pinned],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 고정 토글
app.patch("/notices/:id/pin", (req, res) => {
  const { is_pinned } = req.body;
  db.query(
    "UPDATE NOTICE SET is_pinned = ? WHERE notice_id = ?",
    [is_pinned, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      res.json({ success: true });
    },
  );
});

// 공지사항 삭제
app.delete("/notices/:id", (req, res) => {
  db.query("DELETE FROM NOTICE WHERE notice_id = ?", [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json({ success: true });
  });
});

app.listen(3001, () => {
  console.log("서버 실행 중: http://localhost:3001");
});
