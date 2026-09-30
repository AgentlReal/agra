import { learningController } from "@/modules/learning/learning.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ attempt_id: string }> }
) {
    const resolvedParams = await params;
    return learningController.getAttempt(resolvedParams);
}
