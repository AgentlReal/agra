import { adminController } from "@/modules/admin/admin.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ questionId: string }> }
) {
    const resolvedParams = await params;
    return adminController.getQuestionDetail(resolvedParams);
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ questionId: string }> }
) {
    const resolvedParams = await params;
    return adminController.updateQuestion(req, resolvedParams);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ questionId: string }> }
) {
    const resolvedParams = await params;
    return adminController.deleteQuestion(resolvedParams);
}

