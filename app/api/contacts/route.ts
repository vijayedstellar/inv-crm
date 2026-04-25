import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { z } from "zod";

const ContactInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  accountId: z.string().uuid().optional(),
});

export async function GET() {
  const rows = await db.select().from(contacts).limit(100);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ContactInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [row] = await db.insert(contacts).values(parsed.data).returning();
  return Response.json(row, { status: 201 });
}
