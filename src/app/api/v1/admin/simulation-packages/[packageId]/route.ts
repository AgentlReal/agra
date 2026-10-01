import { adminController } from "@/modules/admin/admin.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ packageId: string }> }
) {
    const resolvedParams = await params;
    return adminController.getSimulationPackage(resolvedParams);
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ packageId: string }> }
) {
    const resolvedParams = await params;
    return adminController.updateSimulationPackage(req, resolvedParams);
}
