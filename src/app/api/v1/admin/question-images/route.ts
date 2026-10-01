import { adminController } from "@/modules/admin/admin.controller";

export async function POST(req: Request) {
    return adminController.uploadQuestionImage(req);
}
