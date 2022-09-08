import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken"
import auth from "../config/auth";
import AppError from "../error/AppError";


export default function ensureAutheticated(req: Request, res: Response, next: NextFunction): void{
    const authHeader = req.headers.authorization;
    const secret = process.env.SECRET ?? ""

    if (!authHeader){
        throw new AppError("JWT token is missing", 401)
    }

    const [, token] = authHeader.split(' ');
    try {
        const decoded = verify(token, secret) as JwtPayload;
        const { sub } = decoded

        req.user = {
            id: sub,
        }

        return next();
    } catch {
        throw new AppError("Invalid JWT token", 401);
    }
}