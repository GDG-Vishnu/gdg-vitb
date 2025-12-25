"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

export async function getAllUsers() {
  try {
    // Check if user is authenticated and has admin privileges
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user) {
      redirect("/auth/login");
    }

    // Check if user has admin role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            accounts: true,
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function getUsersCount() {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has admin role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    const totalUsers = await prisma.user.count();
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    return {
      success: true,
      data: {
        total: totalUsers,
        byRole: usersByRole,
        recent: recentUsers,
      },
    };
  } catch (error) {
    console.error("Error fetching users count:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch user statistics",
    };
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has admin role
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true, id: true },
    });

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // Prevent admin from changing their own role
    if (currentUser.id === userId) {
      return { success: false, error: "Cannot change your own role" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}
