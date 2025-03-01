import { supabase } from "@/db";

export async function uploadFile(
  file: File,
  folder: string
): Promise<string | null> {
  try {
    if (!file) throw new Error("No file provided");

    const filePath = `${folder}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return urlData.publicUrl || null;
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
}

// Function to upload multiple files
export async function manyUpload(
  files: File[],
  folder: string
): Promise<string[]> {
  try {
    if (!files || files.length === 0) throw new Error("No files provided");

    const uploadPromises = files.map((file) => uploadFile(file, folder));
    const uploadedUrls = await Promise.all(uploadPromises);

    // Filter out any null values (failed uploads)
    return uploadedUrls.filter((url) => url !== null) as string[];
  } catch (error) {
    console.error("Multiple file upload error:", error);
    return [];
  }
}
