"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/require-admin";

const setRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

const resetPasswordSchema = z.object({
  userId: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const setUserRole = async (input: z.infer<typeof setRoleSchema>) => {
  await requireAdmin();
  const parsed = setRoleSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await auth.api.setRole({
      body: {
        userId: parsed.data.userId,
        role: parsed.data.role,
      },
      headers: await headers(),
    });
    revalidatePath("/users");
    revalidatePath(`/users/${parsed.data.userId}`);
    revalidatePath("/audit");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update role",
    };
  }
};

export const resetUserPassword = async (
  input: z.infer<typeof resetPasswordSchema>,
) => {
  await requireAdmin();
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await auth.api.setUserPassword({
      body: {
        userId: parsed.data.userId,
        newPassword: parsed.data.newPassword,
      },
      headers: await headers(),
    });
    revalidatePath("/users");
    revalidatePath(`/users/${parsed.data.userId}`);
    revalidatePath("/audit");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to reset password",
    };
  }
};
