import { Router } from "express";
import categoriaRoutes from "./categoria.routes";

const router = Router();

router.use("/", categoriaRoutes);

export default router;
