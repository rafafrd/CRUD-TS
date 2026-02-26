import { Request, Response } from "express"; 
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
  constructor(readonly _service = new CategoriaService()) { }

    selecionarTodos = async (req: Request, res: Response) => {
      try {
        const categorias = await this._service.selecionarTodos();
        res.status(200).json({"categorias": categorias});
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar categorias", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar categorias:", error);
      }
    }

    selecionarPorId = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const categoria = await this._service.selecionarPorId(id);
        if (categoria) {
          res.status(200).json({ categoria });
        } else {
          res.status(404).json({ message: "Categoria não encontrada" });
        }
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar categoria por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar categoria por ID:", error);
      }
    }

    selecionarPorNome = async (req: Request, res: Response) => {
        try {
          const { nome } = req.query;
          if (!nome || typeof nome !== 'string') { //sonaqube obriga a validação do tipo
            return res.status(400).json({ error: "Parâmetro 'nome' é obrigatório e deve ser um texto válido." });
          }
          // Remove espaços em branco nas pontas que poderiam quebrar o LIKE do banco
          const nomeBuscado = nome.trim();
          if (nomeBuscado.length === 0) {
            return res.status(400).json({ error: "Parâmetro 'nome' não pode ser vazio." });
          }
          const categorias = await this._service.selecionarPorNome(nomeBuscado);
          if (categorias.length === 0) {
            return res.status(404).json({ message: "Nenhuma categoria encontrada com esse nome" });
          }
          return res.status(200).json(categorias);
        
        } catch (error: unknown) {
          console.error("Erro ao selecionar categorias por nome:", error);
          return res.status(500).json({ 
            error: "Erro ao selecionar categorias por nome", 
            errorMessage: error instanceof Error ? error.message : "Erro desconhecido" 
          });
        }
      }

    criar = async (req: Request, res: Response) => {
      try {
        const { nome } = req.body;
        const resultado = await this._service.criar(nome);
        res.status(201).json({ message: "Categoria criada com sucesso", resultado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao criar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao criar categoria:", error);
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

    deletar = async (req: Request, res: Response) => {
      try {
        const id = Number(req.query.id);
        const deletado = await this._service.deletar(id);
        if (deletado.affectedRows === 0) {
          return res.status(404).json({ message: "Categoria não encontrada para deletar" });
        }
        res.status(200).json({ message: "Categoria deletada com sucesso", deletado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao deletar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao deletar categoria:", error);
      }
    }
  }
