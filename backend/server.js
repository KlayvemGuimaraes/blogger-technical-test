const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// List all news
app.get('/news', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

// Get news by ID
app.get('/news/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (err) {
    console.error('Error fetching news by ID:', err);
    res.status(500).json({ error: 'Error fetching news by ID' });
  }
});

// Create news
app.post('/news', upload.single('image'), async (req, res) => {
  try {
    console.log('req.body:', req.body)
    const { title, summary } = req.body;
    const content = req.body.content || req.body.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Field "content" is required and must be a string' });
    }

    const news = await prisma.news.create({
      data: { title, summary, body: content, imageUrl },
    });

    res.status(201).json(news);
  } catch (err) {
    console.error('Error creating news:', err);
    res.status(500).json({ error: 'Error creating news' });
  }
});

// Update news
app.put('/news/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, summary } = req.body;
    const content = req.body.content || req.body.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Field "content" is required and must be a string' });
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: { title, summary, body: content, ...(imageUrl && { imageUrl }) },
    });

    res.json(updatedNews);
  } catch (err) {
    console.error('Error updating news:', err);
    res.status(500).json({ error: 'Error updating news' });
  }
});

// Delete news
app.delete('/news/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const news = await prisma.news.findUnique({ where: { id } });

    if (!news) return res.status(404).json({ error: 'News not found' });

    if (news.imageUrl) {
      const filePath = path.join(__dirname, news.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.news.delete({ where: { id } });

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Error deleting news' });
  }
});

app.listen(3001, () => console.log('Backend running on port 3001'));
