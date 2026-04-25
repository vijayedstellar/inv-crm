import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const ContactInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  title: z.string().optional(),
  source: z.string().optional(),
  courseInterest: z.string().optional(),
  score: z.number().int().min(0).max(100).optional().default(0),
  stage: z.enum(["contact", "lead", "mql", "sql", "opportunity", "won", "lost"]).optional().default("contact"),
  owner: z.string().optional(),
  type: z.string().optional().default("B2C"),
  accountId: z.string().uuid().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const rows = stage
    ? await db.select().from(contacts).where(eq(contacts.stage, stage as "contact" | "lead" | "mql" | "sql" | "opportunity" | "won" | "lost")).limit(200)
    : await db.select().from(contacts).limit(200);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ContactInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const [row] = await db
    .insert(contacts)
    .values({
      ...data,
      email: data.email || undefined,
      lastActivityAt: new Date(),
    })
    .returning();
  return Response.json(row, { status: 201 });
}
