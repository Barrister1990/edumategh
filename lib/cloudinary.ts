// lib/cloudinary.ts
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
}

export const uploadToCloudinary = async (
  file: File,
  folder: string = 'curriculum'
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);

  // Set resource type based on file type
  const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
  }

  return response.json();
};

export const uploadMultipleToCloudinary = async (
  files: { file: File; folder: string }[]
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map(({ file, folder }) => 
    uploadToCloudinary(file, folder)
  );
  
  return Promise.all(uploadPromises);
};