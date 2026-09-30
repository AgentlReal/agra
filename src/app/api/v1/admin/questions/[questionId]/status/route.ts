import { adminController } from "@/modules/admin/admin.controller";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ questionId: string }> }
) {
    const resolvedParams = await params;
    return adminController.toggleQuestionStatus(req, resolvedParams);
}
