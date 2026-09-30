import { curriculumController } from "@/modules/curriculum/curriculum.controller";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ subjectId: string }> }
) {
    const resolvedParams = await params;
    return curriculumController.getCurriculum(resolvedParams);
}
