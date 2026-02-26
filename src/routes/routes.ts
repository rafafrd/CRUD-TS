import { Router } from "express";
import categoriaRoutes from "./categoria.routes";
import produtoRoutes from "./produtos.routes";

const router = Router();

router.use("/", categoriaRoutes);
router.use("/", produtoRoutes);

export default router;
