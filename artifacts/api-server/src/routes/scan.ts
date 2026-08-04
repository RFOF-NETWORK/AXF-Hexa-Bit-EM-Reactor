import { Router } from "express";
import { db, reposTable, alertsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/session";
import { desc } from "drizzle-orm";

const router = Router();

// GET /api/scan/summary
router.get("/summary", requireAuth, async (req, res): Promise<void> => {
  try {
    const repos = await db.select().from(reposTable);
    const alerts = await db.select().from(alertsTable);
    const summary = {
      totalRepos: repos.length,
      criticalCount: alerts.filter(a => a.severity === "critical").length,
      highCount: alerts.filter(a => a.severity === "high").length,
      mediumCount: alerts.filter(a => a.severity === "medium").length,
      lowCount: alerts.filter(a => a.severity === "low").length,
      lastScan: new Date().toISOString(),
    };
    res.json(summary);
  } catch (err) {
    req.log.error({ err }, "Scan summary error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/scan/repos
router.get("/repos", requireAuth, async (req, res): Promise<void> => {
  try {
    const repos = await db.select().from(reposTable);
    res.json(repos.map(r => ({
      ...r,
      lastChecked: r.lastChecked.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Repos error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/scan/alerts
router.get("/alerts", requireAuth, async (req, res): Promise<void> => {
  try {
    const alerts = await db.select().from(alertsTable).orderBy(desc(alertsTable.createdAt)).limit(50);
    res.json(alerts.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Alerts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/scan/sessions
router.get("/sessions", requireAuth, async (_req, res): Promise<void> => {
  const reports = [
    {
      version: "v0.0.1",
      title: "First Push & Security Incident",
      date: "2026-08-03",
      path: "docs/session-report-v0.0.1.md",
    },
    {
      version: "v0.0.2",
      title: "Cross-Repository Vulnerability Pattern",
      date: "2026-08-03",
      path: "docs/session-report-v0.0.2.md",
    },
    {
      version: "v0.0.3",
      title: "Versioning Protocol & Workflow Fixes",
      date: "2026-08-03",
      path: "docs/session-report-v0.0.3.md",
    },
  ];
  res.json(reports);
});

export default router;
