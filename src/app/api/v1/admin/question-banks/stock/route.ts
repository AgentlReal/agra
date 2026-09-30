import { adminController } from "@/modules/admin/admin.controller";

export async function GET() {
    return adminController.getQuestionStock();
}
