import { adminController } from "@/modules/admin/admin.controller";

export async function GET(req: Request) {
    return adminController.listSimulationPackages(req);
}

export async function POST(req: Request) {
    return adminController.createSimulationPackage(req);
}
