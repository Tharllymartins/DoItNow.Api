import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken"
import auth from "../config/auth";


export default function ensureAutheticated(req: Request, res: Response, next: NextFunction): void{
    const authHeader = req.headers.authorization;

    if (!authHeader){
        throw new Error("JWT token is missing")
    }

    const [, token] = authHeader.split(' ');
    try {
        const decoded = verify(token, auth.jwt.secret) as JwtPayload;
        const { sub } = decoded

        req.user = {
            id: sub,
        }

        return next();
    } catch {
        throw new Error("Invalid JWT token");
    }
}