import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { requireAdmin } from "@/lib/require-admin";
import { MAX_IMAGES } from "@/lib/gallery-payload";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: MAX_IMAGES } })
        .middleware(async () => {
            // requireAdmin (not getSession) so a deleted admin's still-valid
            // 5-day token cannot keep uploading files to your account.
            const session = await requireAdmin();
            if (!session) throw new UploadThingError("Unauthorized");
            return { userId: session.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId, file.key);
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
