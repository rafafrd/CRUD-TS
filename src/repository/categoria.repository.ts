import {db} from "../database/db.connection";
import {Icategoria} from "../models/categoria.model";
import { ResultSetHeader } from "mysql2";

export class CategoriaRepository {
  async findAll(): Promise<Icategoria[]>{
    const [rows] = await db.execute<Icategoria[]>("SELECT * FROM categorias;");
    return rows; 
  }
  // Omit => Omite os campos discriminados do tipo, nesse caso o id, pois ele é auto incrementado (banco gera)
  async create(dados: Omit<Icategoria, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO categorias (nome, ativo) VALUES (?, ?);";
    const values = [dados._nome, dados._ativo];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, dados: Omit<Icategoria, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE categorias SET nome = ?, ativo = ? WHERE id = ?;";
    const values = [dados._nome, dados._ativo, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}