import { recallController } from "@/modules/recall/recall.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ attemptId: string }> }
) {
    const resolvedParams = await params;
    return recallController.getResult(resolvedParams);
}
