import { adminController } from "@/modules/admin/admin.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ packageId: string }> }
) {
    const resolvedParams = await params;
    return adminController.getSimulationPackageStats(resolvedParams);
}
