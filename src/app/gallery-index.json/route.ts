import { allItems } from "@/lib/gallery";

// Статический JSON со всеми артами — загружается галереей только при поиске по автору.
export const dynamic = "force-static";

export function GET() {
  return Response.json(allItems());
}
