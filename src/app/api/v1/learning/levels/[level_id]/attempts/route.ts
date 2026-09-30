import { learningController } from "@/modules/learning/learning.controller";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ level_id: string }> }
) {
    const resolvedParams = await params;
    return learningController.startAttempt(req, resolvedParams);
}
