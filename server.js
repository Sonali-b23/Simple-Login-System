const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new Database('users.db');

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Schema: last_fail_time stores the timestamp of the 4th failure
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY, 
    password TEXT, 
    fail_count INTEGER DEFAULT 0,
    last_fail_time INTEGER DEFAULT 0
  )
`);

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    try {
        db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, password);
        res.status(201).json({ message: "Registration successful!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists." });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) return res.status(404).json({ error: "User not found." });

    const currentTime = Date.now();
    const cooldown = 10000; // 10 seconds

    // 1. BLOCK CHECK: If they have 4 failures, check the timer
    if (user.fail_count >= 4) {
        const timePassed = currentTime - user.last_fail_time;

        if (timePassed < cooldown) {
            const secondsLeft = Math.ceil((cooldown - timePassed) / 1000);
            return res.status(403).json({ 
                error: `Account is blocked... try after ${secondsLeft} secs` 
            });
        } else {
            // 10 seconds passed: Reset fails so they can try again
            db.prepare('UPDATE users SET fail_count = 0 WHERE email = ?').run(email);
            user.fail_count = 0;
        }
    }

    // 2. CREDENTIAL CHECK
    if (user.password === password) {
        // SUCCESS: Reset the fail_count to 0 immediately
        db.prepare('UPDATE users SET fail_count = 0 WHERE email = ?').run(email);
        res.json({ message: "Login successful! Your fail count has been reset." });
    } else {
        // FAILURE: Increment fail count
        const newFailCount = user.fail_count + 1;
        
        // If this was the 4th failure, record the time to start the 10s block
        const timestamp = newFailCount >= 4 ? currentTime : user.last_fail_time;

        db.prepare('UPDATE users SET fail_count = ?, last_fail_time = ? WHERE email = ?')
          .run(newFailCount, timestamp, email);
          
        res.status(401).json({ error: `Invalid password. Attempt ${newFailCount}/4 before block.` });
    }
});

app.listen(3000, () => console.log('Server: http://localhost:3000'));