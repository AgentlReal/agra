import { curriculumController } from "@/modules/curriculum/curriculum.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ submaterialId: string }> }
) {
    const resolvedParams = await params;
    return curriculumController.getSubMaterialProgress(resolvedParams);
}
