import { Request, Response } from "express"; 
import { ProdutoService } from "../services/produto.service";
import fs from "node:fs";
import path from "node:path";

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
          if (!nome || typeof nome !== 'string') {
            return res.status(400).json({ error: "Parâmetro 'nome' é obrigatório e deve ser um texto válido." });
          }
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

    // =============================================
    // CRIAR — recebe form-data com campo "imagem"
    // O multer já rodou como middleware na rota,
    // então req.file já tem o arquivo (ou undefined)
    // =============================================
    criar = async (req: Request, res: Response) => {
      try {
        // form-data envia tudo como STRING, então precisamos converter
        const nome: string = req.body.nome;
        const preco: string = req.body.preco;
        const categoriaId: string = req.body.categoriaId;

        // Valida campos obrigatórios
        if (!nome || !preco || !categoriaId) {
          this.limparImagem(req); // se a imagem subiu mas os dados estão errados, apaga
          return res.status(400).json({
            error: "Campos obrigatórios: 'nome', 'preco' e 'categoriaId'.",
          });
        }

        // Converte strings para números e valida
        const precoNum = Number.parseFloat(preco);
        if (Number.isNaN(precoNum) || precoNum <= 0) {
          this.limparImagem(req);
          return res.status(400).json({ error: "preco deve ser um número maior que zero." });
        }

        const categoriaIdNum = Number.parseInt(categoriaId);
        if (Number.isNaN(categoriaIdNum) || categoriaIdNum <= 0) {
          this.limparImagem(req);
          return res.status(400).json({ error: "categoriaId deve ser um número inteiro maior que zero." });
        }

        // Cria o produto no banco
        const resultado = await this._service.criar(nome, precoNum, categoriaIdNum);

        // Responde com o ID criado + nome do arquivo (se enviou imagem)
        res.status(201).json({
          message: "Produto criado com sucesso",
          id: resultado.insertId,
          imagem: req.file ? req.file.filename : null,
        });
      } catch (error: unknown) {
        this.limparImagem(req); // se deu erro, limpa o arquivo
        res.status(500).json({ error: "Erro ao criar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao criar produto:", error);
      }
    }

    // Método auxiliar para apagar imagem se der erro
    private limparImagem(req: Request): void {
      if (req.file) {
        const imagePath = path.resolve("uploads/images", req.file.filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
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