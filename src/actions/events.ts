"use server";

import { prisma } from "@/lib/prisma";

export async function getAllEvents() {
  try {
    const events = await prisma.events.findMany({
      orderBy: {
        Date: "desc",
      },
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch events",
    };
  }
}

export async function getCurrentEvents() {
  try {
    const now = new Date();

    const events = await prisma.events.findMany({
      where: {
        Date: {
          gte: now,
        },
      },
      orderBy: {
        Date: "asc",
      },
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    console.error("Error fetching current events:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch current events",
    };
  }
}

export async function getPastEvents() {
  try {
    const now = new Date();

    const events = await prisma.events.findMany({
      where: {
        Date: {
          lt: now,
        },
      },
      orderBy: {
        Date: "desc",
      },
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    console.error("Error fetching past events:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch past events",
    };
  }
}

export async function getEventById(id: number) {
  try {
    const event = await prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      return {
        success: false,
        error: "Event not found",
      };
    }

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch event",
    };
  }
}
