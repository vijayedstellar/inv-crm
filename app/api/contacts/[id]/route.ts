import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const PatchInput = z.object({
  stage: z.enum(["contact", "lead", "mql", "sql", "opportunity", "won", "lost"]).optional(),
  score: z.number().int().min(0).max(100).optional(),
  owner: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  courseInterest: z.string().optional(),
  source: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = PatchInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db
    .update(contacts)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(contacts.id, id))
    .returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(contacts).where(eq(contacts.id, id));
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}
