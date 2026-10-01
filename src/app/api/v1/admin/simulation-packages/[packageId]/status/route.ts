import { adminController } from "@/modules/admin/admin.controller";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ packageId: string }> }
) {
    const resolvedParams = await params;
    return adminController.updateSimulationPackageStatus(req, resolvedParams);
}
