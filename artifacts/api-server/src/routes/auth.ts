import { Router, Request } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createSession, destroySession, requireAuth } from "../middlewares/session";
import { LoginBody, ChangePasswordBody } from "@workspace/api-zod";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { username, password } = parsed.data;
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const token = createSession(user.id);
    res.cookie("session", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ id: user.id, username: user.username, createdAt: user.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res): void => {
  const token = req.cookies?.session;
  if (token) destroySession(token);
  res.clearCookie("session");
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res): void => {
  const user = (req as Request & { user: { id: number; username: string; createdAt: Date } }).user;
  res.json({ id: user.id, username: user.username, createdAt: user.createdAt.toISOString() });
});

// PATCH /api/auth/password
router.patch("/password", requireAuth, async (req, res): Promise<void> => {
  const user = (req as Request & { user: { id: number; username: string; passwordHash: string; createdAt: Date } }).user;
  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const { currentPassword, newPassword } = parsed.data;
  try {
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, user.id));
    res.json({ message: "Password changed" });
  } catch (err) {
    req.log.error({ err }, "Password change error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/auth/account
router.delete("/account", requireAuth, async (req, res): Promise<void> => {
  const user = (req as Request & { user: { id: number } }).user;
  const token = req.cookies?.session;
  try {
    await db.delete(usersTable).where(eq(usersTable.id, user.id));
    if (token) destroySession(token);
    res.clearCookie("session");
    res.json({ message: "Account deleted" });
  } catch (err) {
    req.log.error({ err }, "Account deletion error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
