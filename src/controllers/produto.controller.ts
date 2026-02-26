import { Request, Response } from "express"; 
import { ProdutoService } from "../services/produto.service";

export class ProdutoController {
  constructor(readonly _service = new ProdutoService()) { }
    selecionarTodos = async (req: Request, res: Response) => {
      try {
        const produtos = await this._service.selecionarTodos();
        res.status(200).json({"produtos": produtos});
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar produtos", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar produtos:", error);
      }
    }

    selecionarPorId = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const produto = await this._service.selecionarPorId(id);
        if (produto) {
          res.status(200).json({ produto });
        } else {
          res.status(404).json({ message: "Produto não encontrado" });
        }
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar produto por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar produto por ID:", error);
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
          const produtos = await this._service.selecionarPorNome(nomeBuscado);
          if (produtos.length === 0) {
            return res.status(404).json({ message: "Nenhum produto encontrado com esse nome" });
          }
          return res.status(200).json(produtos);
        
        } catch (error: unknown) {
          console.error("Erro ao selecionar produtos por nome:", error);
          return res.status(500).json({ 
            error: "Erro ao selecionar produtos por nome", 
            errorMessage: error instanceof Error ? error.message : "Erro desconhecido" 
          });
        }
      }

    criar = async (req: Request, res: Response) => {
      try {
        const { nome, preco, categoriaId } = req.body;
        if (!nome || typeof nome !== 'string' || typeof preco !== 'number' || typeof categoriaId !== 'number') {
          return res.status(400).json({ error: "Parâmetros 'nome', 'preco' e 'categoriaId' são obrigatórios e devem ser do tipo correto." });
        }
        const resultado = await this._service.criar(nome, preco, categoriaId);
        res.status(201).json({ message: "Produto criado com sucesso", id: resultado.insertId });
        }
      catch (error: unknown) {
        res.status(500).json({ error: "Erro ao criar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao criar produto:", error);
      }
    }

    editar = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const { nome, preco, categoriaId } = req.body;
        if (!nome || typeof nome !== 'string' || typeof preco !== 'number' || typeof categoriaId !== 'number') {
          return res.status(400).json({ error: "Parâmetros 'nome', 'preco' e 'categoriaId' são obrigatórios e devem ser do tipo correto." });
        }
        const resultado = await this._service.editar(id, nome, preco, categoriaId);
        res.status(200).json({ message: "Produto editado com sucesso", id: resultado.affectedRows });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao editar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao editar produto:", error);
      }
    }

    deletar = async (req: Request, res: Response) => {
      try {        const id = Number(req.params.id);
        const resultado = await this._service.deletar(id);
        res.status(200).json({ message: "Produto deletado com sucesso", id: resultado.affectedRows });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao deletar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao deletar produto:", error);
      }
    }
}