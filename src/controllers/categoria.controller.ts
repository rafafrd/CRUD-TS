import { Request, Response } from "express"; 
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
  constructor(private _service = new CategoriaService()) { }

    selecionarTodos = async (req: Request, res: Response) => {
      try {
        const categorias = await this._service.selecionarTodos();
        res.status(200).json({"categorias": categorias});
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar categorias", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar categorias:", error);
      }
    }
    criar = async (req: Request, res: Response) => {
      try {
        const { nome } = req.body;
        const resultado = await this._service.criar(nome);
        res.status(201).json({ message: "Categoria criada com sucesso", resultado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao criar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar categorias:", error);
        }
    }
    editar = async (req: Request, res: Response) => {
      try {
        const { nome, ativo } = req.body;
        const id = Number(req.query.id);
        const alterado = await this._service.editar(id, nome, ativo);
        res.status(200).json({ message: "Categoria editada com sucesso", alterado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao editar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao editar categoria:", error);
      }
    }
  }
