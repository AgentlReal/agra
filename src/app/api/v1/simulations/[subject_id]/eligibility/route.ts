import { simulationController } from "@/modules/simulation/simulation.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ subject_id: string }> }
) {
    const resolvedParams = await params;
    return simulationController.getEligibility(resolvedParams);
}
