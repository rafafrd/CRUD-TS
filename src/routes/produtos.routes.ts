import { Router } from "express";
import { ProdutoController } from "../controllers/produto.controller";
import uploadImage from "../middleware/upload.middleware";

const produtoController = new ProdutoController();
const produtoRoutes = Router();

//get
produtoRoutes.get("/produtos", produtoController.selecionarTodos);
produtoRoutes.get("/produtos/pesquisa", produtoController.selecionarPorNome);
produtoRoutes.get("/produtos/:id", produtoController.selecionarPorId);

// post — uploadImage roda ANTES do controller, adicionando req.file
produtoRoutes.post("/produtos", uploadImage, produtoController.criar);

// patch
produtoRoutes.patch("/produtos/:id", produtoController.editar);

// delete
produtoRoutes.delete("/produtos/:id", produtoController.deletar);

export default produtoRoutes;