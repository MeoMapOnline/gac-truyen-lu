import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

// Helper to get user from DB or create if not exists
async function getOrCreateUser(db: D1Database, encryptedYwId: string, googleData?: any) {
  const user = await db.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(encryptedYwId).first();
  
  if (user) {
    // Update info if google data provided
    if (googleData) {
      await db.prepare('UPDATE users SET email = ?, name = ?, avatar = ? WHERE encrypted_yw_id = ?')
        .bind(googleData.email, googleData.name, googleData.picture, encryptedYwId)
        .run();
      return { ...user, ...googleData };
    }
    return user;
  } else {
    // Create new
    const newUser = {
      encrypted_yw_id: encryptedYwId,
      email: googleData?.email || null,
      name: googleData?.name || 'Người dùng mới',
      avatar: googleData?.picture || 'https://via.placeholder.com/150',
      role: 'user',
      gold_balance: 0,
      coin_balance: 0
    };
    
    await db.prepare('INSERT INTO users (encrypted_yw_id, email, name, avatar, role, gold_balance, coin_balance) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(newUser.encrypted_yw_id, newUser.email, newUser.name, newUser.avatar, newUser.role, newUser.gold_balance, newUser.coin_balance)
      .run();
      
    return newUser;
  }
}

// Auth with Google
app.post('/api/auth/google', async (c) => {
  const { token, userInfo } = await c.req.json();
  // In real app, verify token. Here we trust the frontend sent valid info for MVP.
  // We use the Google ID (sub) or email as the unique key if we weren't using platform ID.
  // But to be safe and consistent, let's use the email as the link.
  
  // For this specific request, we'll use the platform's X-Encrypted-Yw-ID as the primary key
  // and link the Google info to it.
  const encryptedYwId = c.req.header('X-Encrypted-Yw-ID') || 'anonymous_' + Date.now();
  
  const user = await getOrCreateUser(c.env.DB, encryptedYwId, userInfo);
  
  // Get unlocked chapters
  const { results: unlocks } = await c.env.DB.prepare('SELECT chapter_id FROM unlocks WHERE user_id = (SELECT id FROM users WHERE encrypted_yw_id = ?)').bind(encryptedYwId).all();
  
  return c.json({
    user: {
      ...user,
      unlockedChapters: unlocks.map(u => u.chapter_id)
    }
  });
});

// Get Me
app.get('/api/me', async (c) => {
  const encryptedYwId = c.req.header('X-Encrypted-Yw-ID');
  if (!encryptedYwId) return c.json({ error: 'Unauthorized' }, 401);
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(encryptedYwId).first();
  if (!user) return c.json({ user: null });
  
  const { results: unlocks } = await c.env.DB.prepare('SELECT chapter_id FROM unlocks WHERE user_id = ?').bind(user.id).all();
  
  return c.json({
    user: {
      ...user,
      unlockedChapters: unlocks.map(u => u.chapter_id)
    }
  });
});

// Stories
app.get('/api/stories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM stories').all();
  
  // Get chapters for each story
  const storiesWithChapters = await Promise.all(results.map(async (story) => {
    const { results: chapters } = await c.env.DB.prepare('SELECT id, title, chapter_order, price, is_locked, created_at FROM chapters WHERE story_id = ? ORDER BY chapter_order').bind(story.id).all();
    return { ...story, chapters, tags: JSON.parse(story.tags as string || '[]') };
  }));
  
  return c.json(storiesWithChapters);
});

app.get('/api/stories/:id', async (c) => {
  const id = c.req.param('id');
  const story = await c.env.DB.prepare('SELECT * FROM stories WHERE id = ?').bind(id).first();
  if (!story) return c.json({ error: 'Not found' }, 404);
  
  const { results: chapters } = await c.env.DB.prepare('SELECT id, title, chapter_order, price, created_at FROM chapters WHERE story_id = ? ORDER BY chapter_order').bind(id).all();
  
  // Add isLocked flag logic (mock: lock after chapter 5)
  const chaptersWithLock = chapters.map((ch: any) => ({
    ...ch,
    isLocked: ch.price > 0
  }));

  return c.json({
    ...story,
    tags: JSON.parse(story.tags as string || '[]'),
    chapters: chaptersWithLock
  });
});

// Chapter Content
app.get('/api/chapters/:id', async (c) => {
  const id = c.req.param('id');
  const encryptedYwId = c.req.header('X-Encrypted-Yw-ID');
  
  const chapter = await c.env.DB.prepare('SELECT * FROM chapters WHERE id = ?').bind(id).first();
  if (!chapter) return c.json({ error: 'Not found' }, 404);
  
  // Check if locked
  if (chapter.price > 0) {
    if (!encryptedYwId) return c.json({ error: 'Locked', isLocked: true }, 403);
    
    const user = await c.env.DB.prepare('SELECT id FROM users WHERE encrypted_yw_id = ?').bind(encryptedYwId).first();
    if (!user) return c.json({ error: 'Locked', isLocked: true }, 403);
    
    const unlock = await c.env.DB.prepare('SELECT * FROM unlocks WHERE user_id = ? AND chapter_id = ?').bind(user.id, id).first();
    if (!unlock) return c.json({ error: 'Locked', isLocked: true }, 403);
  }
  
  return c.json(chapter);
});

// Unlock
app.post('/api/unlock', async (c) => {
  const { chapterId } = await c.req.json();
  const encryptedYwId = c.req.header('X-Encrypted-Yw-ID');
  if (!encryptedYwId) return c.json({ error: 'Unauthorized' }, 401);
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(encryptedYwId).first();
  if (!user) return c.json({ error: 'User not found' }, 404);
  
  const chapter = await c.env.DB.prepare('SELECT * FROM chapters WHERE id = ?').bind(chapterId).first();
  if (!chapter) return c.json({ error: 'Chapter not found' }, 404);
  
  if (user.gold_balance < chapter.price) {
    return c.json({ error: 'Insufficient balance' }, 400);
  }
  
  // Transaction
  try {
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET gold_balance = gold_balance - ? WHERE id = ?').bind(chapter.price, user.id),
      c.env.DB.prepare('INSERT INTO unlocks (user_id, chapter_id) VALUES (?, ?)').bind(user.id, chapterId),
      c.env.DB.prepare('INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)').bind(user.id, chapter.price, 'unlock')
    ]);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Deposit (Mock)
app.post('/api/deposit', async (c) => {
  const { amount } = await c.req.json();
  const encryptedYwId = c.req.header('X-Encrypted-Yw-ID');
  if (!encryptedYwId) return c.json({ error: 'Unauthorized' }, 401);
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(encryptedYwId).first();
  
  if (user) {
    await c.env.DB.prepare('UPDATE users SET gold_balance = gold_balance + ? WHERE id = ?').bind(amount, user.id).run();
  } else {
    // Create if not exists (shouldn't happen if logged in properly)
    await getOrCreateUser(c.env.DB, encryptedYwId);
    await c.env.DB.prepare('UPDATE users SET gold_balance = gold_balance + ? WHERE encrypted_yw_id = ?').bind(amount, encryptedYwId).run();
  }
  
  return c.json({ success: true });
});

// Increment View
app.post('/api/stories/:id/view', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE stories SET view_count = view_count + 1 WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

export default app;
