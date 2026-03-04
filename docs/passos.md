O que foi corrigido

1. Instalou multer — só tinha o @types/multer, faltava o pacote.
2. produto.multer.ts — parâmetro fileSize renomeado para file no callback destination (era um bug que sombreava a variável).
3. upload.middleware.ts — mudou de .array("images", 10) para .single("imagem") (1 imagem por produto) e removeu o .js do import.
4. produto.controller.ts — o método criar estava completamente quebrado (código de duas abordagens misturado). Reescrito de forma limpa.
5. produtos.routes.ts — multer adicionado como middleware na rota: uploadImage roda ANTES do controller.
6. server.ts — adicionou express.static para servir imagens em /uploads/.

Como testar no Insomnia/Postman
POST /produtos — usar Multipart Form-Data:

Campo Tipo Valor
nome Text Camiseta
preco Text 29.99
categoria - Id - Text 1
imagem File selecione um .jpg/.png
O campo do arquivo deve se chamar imagem — é o nome que o multer espera.

Como funciona o fluxo
Requisição POST /produtos (form-data)
│
▼
uploadImage (middleware multer)
→ Salva arquivo em /uploads/images/hash-nomeoriginal.jpg
→ Adiciona req.file com info do arquivo
│
▼
ProdutoController.criar
→ Lê req.body (nome, preco, categoriaId) — tudo vem como STRING em form-data
→ Converte para número com Number.parseFloat / Number.parseInt
→ Valida os campos
→ Se erro → apaga a imagem que já subiu (limparImagem)
→ Se ok → salva no banco e retorna { id, imagem }

A imagem fica acessível em: GET /uploads/images/<nome-do-arquivo>
