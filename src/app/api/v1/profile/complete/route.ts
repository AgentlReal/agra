import { profileController } from "@/modules/profile/profile.controller";

export async function POST(req: Request) {
    return profileController.completeProfile(req);
}
