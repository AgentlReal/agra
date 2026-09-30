import { learningController } from "@/modules/learning/learning.controller";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ attempt_id: string }> }
) {
    const resolvedParams = await params;
    return learningController.submitAttempt(resolvedParams);
}
