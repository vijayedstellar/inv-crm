import { db } from "@/lib/db";
import { opportunities } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const PatchInput = z.object({
  dealStage: z.string().optional(),
  stage: z.enum(["contact", "lead", "mql", "sql", "opportunity", "won", "lost"]).optional(),
  probability: z.number().int().min(0).max(100).optional(),
  amount: z.number().optional(),
  closeDate: z.string().optional(),
  ownerId: z.string().optional(),
  name: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = PatchInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { amount, closeDate, ...rest } = parsed.data;
  const [row] = await db
    .update(opportunities)
    .set({
      ...rest,
      ...(amount != null ? { amount: String(amount) } : {}),
      ...(closeDate ? { closeDate: new Date(closeDate) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(opportunities.id, id))
    .returning();
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db.select().from(opportunities).where(eq(opportunities.id, id));
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(row);
}
