"use server";

import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { registerSchema } from "schemas/register-schema";
import { updateUserNameSchema } from "schemas/user-schema";
import { randomBytes } from "crypto";
import { sendEmail } from "lib/mail";

import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { auth } from "../../web/lib/auth";

// Helper function to get configured Cloudinary instance
async function getCloudinaryClient() {
  try {
    const { v2: cloudinary } = await import("cloudinary");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    return cloudinary;
  } catch (error) {
    console.error("Failed to configure Cloudinary:", error);
    throw new Error("Cloudinary configuration failed");
  }
}

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

  const message = `Hello ${name},

  Welcome to Qivee! 🎉

  We're thrilled to have you join our community of savvy shoppers. Your journey to discovering amazing products, exclusive deals, and seamless shopping starts now!

  🛍️ What You Can Expect:
  Exclusive discounts & offers
  A wide range of high-quality products
  Fast & secure checkout
  24/7 customer support

  Start exploring now: www.qivee.com

  If you have any questions, our support team is always here to help.

  Happy shopping! 🛒
  Best Regards,
  The Qivee Team
  support@qivee.com | www.qivee.com
  `;

  try {
    await sendEmail({
      email,
      subject: "Welcome to Qivee",
      message,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: true,
      message: "User registered successfully, but email failed to send.",
    };
  }

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

  // Create unique filename to avoid conflicts
  const uniqueFilename = `${Date.now()}-${file.name}`;
  const tempPath = join("tmp", uniqueFilename);

  try {
    await writeFile(tempPath, buffer);
  } catch (error) {
    console.error("Failed to write temp file:", error);
    return { error: { message: "File processing failed" } };
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    // Clean up temp file
    try {
      await unlink(tempPath);
    } catch (unlinkError) {
      console.error("Failed to clean up temp file:", unlinkError);
    }
    return { error: { id: "User not found" } };
  }

  try {
    // Get Cloudinary client with dynamic import
    const cloudinary = await getCloudinaryClient();

    // Delete old avatar if exists
    if (user.avatar) {
      try {
        const publicId = user.avatar.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`avatars/${publicId}`);
        }
      } catch (deleteError) {
        console.error("Failed to delete old avatar:", deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new avatar
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "avatars",
      resource_type: "image",
      crop: "scale",
      width: 150,
      quality: "auto",
    });

    // Clean up temp file
    await unlink(tempPath);

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id },
      data: { avatar: result.secure_url },
    });

    console.log("Avatar updated successfully for user:", updatedUser.id);

    return {
      success: true,
      avatarUrl: result.secure_url,
      updatedUser,
      message: "User avatar updated successfully",
    };
  } catch (error: any) {
    console.error("Avatar update failed:", error);

    // Ensure temp file is deleted even if upload fails
    try {
      await unlink(tempPath);
    } catch (unlinkError) {
      console.error("Failed to delete temporary file:", unlinkError);
    }

    return {
      error: {
        message: error.message || "Avatar upload failed",
      },
    };
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

  const message = `Hello ${user.name},

We received a request to reset your password for your Qivee account. No worries — we’ve got you! 🔐

Click the link below to securely reset your password:

${resetPasswordURL}

⚠️ If you did *not* request this, please ignore this email. Your account will remain secure.

For any help, feel free to reach out to our support team.

Stay safe,
The Qivee Team
support@qivee.com | www.qivee.com
`;

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

  const message = `Hello ${user.name},

    We wanted to let you know that your password was successfully changed. If you made this change, no further action is needed.

    If you didn’t request this change, please reset your password immediately or contact our support team for assistance.

    🔒 Stay Secure:

    Never share your password with anyone.

    Use a strong, unique password for your account.

    Enable two-factor authentication if available.

    If you have any questions, feel free to reach out to us.

    Best Regards,
      The Qivee Team
      support@qivee.com | www.qivee.com
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Successful",
      message,
    });
  } catch (error) {
    console.error("Failed to send password changed email:", error);
  }
  return { success: true, message: "Password reset successfully" };
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return { error: { message: "Unauthorised request" } };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: { message: "User not found" } };
  }

  const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidOldPassword) {
    return { error: { message: "Incorrect old password" } };
  }

  if (isValidOldPassword) {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  const message = `Hello ${user.name},

  We wanted to let you know that your password was successfully changed. If you made this change, no further action is needed.

  If you didn’t request this change, please reset your password immediately or contact our support team for assistance.

  🔒 Stay Secure:

  Never share your password with anyone.

  Use a strong, unique password for your account.

  Enable two-factor authentication if available.

  If you have any questions, feel free to reach out to us.

  Best Regards,
    The Qivee Team
    support@qivee.com | www.qivee.com
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Successful",
      message,
    });
  } catch (error) {
    console.error("Failed to send password changed email:", error);
  }

  return { success: true, message: "Password updated successfully" };
}

export async function getAllUsers() {
  const users = await db.user.findMany();
  return { success: true, users, message: "Users retrieved successfully" };
}
