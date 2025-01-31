import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  try {
    const maxId = await prisma.project.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const nextId = (maxId?.id || 0) + 1;
    console.log("Next ID will be:", nextId);

    const newProject = await prisma.project.create({
      data: {
        id: nextId,
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    console.log("Created project:", newProject);
    res.status(201).json(newProject);
  } catch (error: any) {
    console.error("Project creation error details:", error);
    res.status(500).json({
      message: `Error creating a project: ${error.message}`,
      details: error,
    });
  }
};
