import { recallController } from "@/modules/recall/recall.controller";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ attemptId: string; questionId: string }> }
) {
    const resolvedParams = await params;
    return recallController.saveAnswer(req, resolvedParams);
}
