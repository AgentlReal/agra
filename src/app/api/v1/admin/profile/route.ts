import { adminController } from "@/modules/admin/admin.controller";

export async function GET() {
    return adminController.getProfile();
}

export async function PATCH(req: Request) {
    return adminController.updateProfile(req);
}
