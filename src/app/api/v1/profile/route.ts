import { profileController } from "@/modules/profile/profile.controller";

export async function GET() {
    return profileController.getProfile();
}

export async function PATCH(req: Request) {
    return profileController.updateProfile(req);
}

