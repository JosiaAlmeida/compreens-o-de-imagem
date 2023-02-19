import express from "express";
import { multerConfig } from "./utils/upload";
import { compressImage } from "./middleware/file-helper";

const app = express()

// ROTA PARA GET, RENDERIZAR O FORMULÁRIO
app.get('/nova-imagem', (req, res, next) => {
  res.send(`
            <html>
                <head> 
                    <title> Nova imagem </title>
                </head>
                </body>
                    <!-- O enctype é de extrema importância! Não funciona sem! -->
                    <form action="/nova-imagem"  method="POST" enctype="multipart/form-data">
                        <!-- O NAME do input deve ser exatamente igual ao especificado na rota -->
                        <input type="file" name="image">
                        <button type="submit"> Enviar </button>
                    </form>
                </body>
            </html>
        `);
});
app.post('/nova-imagem', multerConfig.single('image'), (req, res, next) => {

  // Se houve sucesso no armazenamento
  if (req.file) {

    // Vamos mandar essa imagem para compressão antes de prosseguir
    // Ela vai retornar o a promise com o novo caminho como resultado, então continuamos com o then.
    return compressImage(req.file, 100)
      .then(newPath => {
        // Vamos continuar normalmente, exibindo o novo caminho
        return res.send("Upload e compressão realizados com sucesso! O novo caminho é:" + newPath);

      })
      .catch(err => console.log(err));
  }
  // Se o objeto req.file for undefined, ou seja, não houve sucesso, vamos imprimir um erro!
  return res.send('Houve erro no upload!');

});

app.listen(7777)