import { recallController } from "@/modules/recall/recall.controller";

export async function POST() {
    return recallController.startAttempt();
}
