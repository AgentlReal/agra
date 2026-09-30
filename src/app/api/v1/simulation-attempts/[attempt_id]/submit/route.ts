import { simulationController } from "@/modules/simulation/simulation.controller";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ attempt_id: string }> }
) {
    const resolvedParams = await params;
    return simulationController.submitAttempt(resolvedParams);
}
