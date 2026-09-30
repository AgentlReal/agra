import { recallController } from "@/modules/recall/recall.controller";

export async function GET() {
    return recallController.getStatus();
}
