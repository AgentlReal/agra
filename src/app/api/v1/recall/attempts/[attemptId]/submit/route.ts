import { recallController } from "@/modules/recall/recall.controller";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ attemptId: string }> }
) {
    const resolvedParams = await params;
    return recallController.submitAttempt(resolvedParams);
}
