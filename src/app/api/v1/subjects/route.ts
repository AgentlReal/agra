import { curriculumController } from "@/modules/curriculum/curriculum.controller";

export async function GET() {
    return curriculumController.listSubjects();
}
