import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { z } from "zod";

const AccountInput = z.object({
  name: z.string().min(1),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  type: z.string().optional().default("B2B"),
  healthScore: z.number().int().min(0).max(100).optional().default(75),
});

export async function GET() {
  const rows = await db.select().from(accounts).limit(100);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = AccountInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db.insert(accounts).values(parsed.data).returning();
  return Response.json(row, { status: 201 });
}
