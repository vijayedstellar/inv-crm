import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { z } from "zod";

const TaskInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  taskType: z.string().optional(),
  priority: z.string().optional().default("medium"),
  dueDate: z.string().optional(),
  assigneeName: z.string().optional(),
});

export async function GET() {
  const rows = await db.select().from(tasks).limit(100);
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = TaskInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { dueDate, ...rest } = parsed.data;
  const [row] = await db
    .insert(tasks)
    .values({
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })
    .returning();
  return Response.json(row, { status: 201 });
}
