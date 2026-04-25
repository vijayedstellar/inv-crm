import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { z } from "zod";

const LeadInput = z.object({
  contactId: z.string().uuid(),
  source: z.string().optional(),
  stage: z.enum(["lead", "mql", "sql", "opportunity", "won", "lost"]).optional(),
  score: z.number().int().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const rows = await db.select().from(leads).limit(100);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = LeadInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db.insert(leads).values(parsed.data).returning();
  return Response.json(row, { status: 201 });
}
