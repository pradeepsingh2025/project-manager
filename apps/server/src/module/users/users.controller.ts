import type { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service.js";

export async function getUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await usersService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
