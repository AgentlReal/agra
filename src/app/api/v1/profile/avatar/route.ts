import { profileController } from "@/modules/profile/profile.controller";

export async function PUT(req: Request) {
    return profileController.updateAvatar(req);
}

export async function PATCH(req: Request) {
    return profileController.updateAvatar(req);
}

