// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 创建 MySQL 数据库连接
const db = mysql.createConnection({
    host: 'localhost', // 数据库地址
    user: 'root',      // 数据库用户名
    password: '',      // 数据库密码（根据实际情况修改）
    database: 'task_manager' // 数据库名称
});

// 测试数据库连接
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// 获取所有任务
app.get('/api/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        } else {
            res.json(results);
        }
    });
});

// 添加新任务
app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
    if (task) {
        const query = 'INSERT INTO tasks (content) VALUES (?)';
        db.query(query, [task], (err, result) => {
            if (err) {
                console.error('Error adding task:', err);
                res.status(500).json({ error: 'Failed to add task' });
            } else {
                res.status(201).json({ message: 'Task added', task });
            }
        });
    } else {
        res.status(400).json({ error: 'Task content is required' });
    }
});

// edit
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const query = 'UPDATE tasks SET content = ? WHERE id = ?';
    db.query(query, [content, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Failed to update task' });
        } else {
            res.json({ message: 'Task updated successfully' });
        }
    });
});

// 添加删除任务的路由
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            res.status(500).json({ error: 'Failed to delete task' });
        } else {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
