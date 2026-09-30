import { profileController } from "@/modules/profile/profile.controller";

export async function GET(req: Request) {
    return profileController.getXpTransactions(req);
}
