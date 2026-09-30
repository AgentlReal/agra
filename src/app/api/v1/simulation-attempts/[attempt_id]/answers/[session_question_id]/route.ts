import { simulationController } from "@/modules/simulation/simulation.controller";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ attempt_id: string; session_question_id: string }> }
) {
    const resolvedParams = await params;
    return simulationController.saveAnswer(req, resolvedParams);
}
