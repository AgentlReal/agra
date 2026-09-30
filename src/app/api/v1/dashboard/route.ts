import { profileController } from "@/modules/profile/profile.controller";

export async function GET() {
    return profileController.getDashboard();
}
