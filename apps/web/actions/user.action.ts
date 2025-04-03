"use server";

import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { registerSchema } from "schemas/register-schema";
import {
  updateUserAvatarSchema,
  updateUserNameSchema,
} from "schemas/user-schema";
import { randomBytes } from "crypto";
import { sendEmail } from "lib/mail";

import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function createUser(formData: FormData) {
  const parsedData = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const { name, email, password } = parsedData.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: { email: "Email is already in use" } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { success: true };
}

export async function updateName(id: string, name: string) {
  console.log("update Name called");

  if (!id || !name) {
    return { error: { message: "Invalid input" } };
  }

  const parsedData = updateUserNameSchema.safeParse({ id, name });
  if (!parsedData.success) {
    return { error: parsedData.error.flatten() };
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return { error: { id: "User not found" } };
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: { name },
  });

  return {
    success: true,
    updatedUser,
    message: "User name updated successfully",
  };
}

export async function updateAvatar(id: string, file: File) {
  console.log("update avatar called");

  if (!id || !file) {
    return { error: { message: "Invalid input" } };
  }

  // Convert file to buffer for upload
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save the file temporarily (optional, useful for debugging)
  const tempPath = join("tmp", file.name);
  await writeFile(tempPath, buffer);

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    return { error: { id: "User not found" } };
  }

  try {
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop()?.split(".")[0]; // Extract public ID
      if (publicId) {
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      }
    }

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "avatars",
      resource_type: "image",
      crop: "scale",
      width: 150,
    });

    await unlink(tempPath);

    const updatedUser = await db.user.update({
      where: { id },
      data: { avatar: result.secure_url },
    });
    console.log("update user: ", updatedUser);
    return {
      success: true,
      avatarUrl: result.secure_url,
      updatedUser,
      message: "User avatar updated successfully",
    };
  } catch (error) {
    console.error("Cloudinary upload failed", error);

    // Ensure local file is deleted even if upload fails
    try {
      await unlink(tempPath);
    } catch (unlinkError) {
      console.error("Failed to delete temporary file:", unlinkError);
    }

    return { error: { message: "Avatar upload failed" } };
  }
}

export async function requestPasswordReset(email: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { error: { message: "User not found" } };
  }

  const token = randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await db.user.update({
    where: { email },
    data: { resetToken: token, resetExpiry: expiry },
  });

  const resetPasswordURL = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordURL} \n\nIf you have not requested this email then, please ignore it.`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request",
    message,
  });

  return { success: true, message: "Password reset token sent successfully" };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await db.user.findFirst({
    where: { resetToken: token, resetExpiry: { gte: new Date() } },
  });

  if (!user) {
    return { error: { message: "Invalid or expired token" } };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetExpiry: null },
  });

  return { success: true, message: "Password reset successfully" };
}
