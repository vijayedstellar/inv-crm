import { db } from "@/lib/db";
import { opportunities } from "@/lib/db/schema";
import { z } from "zod";

const OppInput = z.object({
  name: z.string().min(1),
  type: z.string().optional().default("B2C"),
  dealStage: z.string().optional().default("Discovery"),
  course: z.string().optional(),
  amount: z.number().optional(),
  closeDate: z.string().optional(),
  probability: z.number().int().min(0).max(100).optional().default(50),
  ownerId: z.string().optional(),
  accountId: z.string().uuid().optional(),
});

export async function GET() {
  const rows = await db.select().from(opportunities).limit(100);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = OppInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { closeDate, amount, ...rest } = parsed.data;
  const [row] = await db
    .insert(opportunities)
    .values({
      ...rest,
      amount: amount != null ? String(amount) : undefined,
      closeDate: closeDate ? new Date(closeDate) : undefined,
    })
    .returning();
  return Response.json(row, { status: 201 });
}
