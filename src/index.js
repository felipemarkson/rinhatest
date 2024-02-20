const express = require("express");
const app = express();
app.use(express.json());
const port = 9999;

const clientes = {
  1: { limite: 100000, saldo: 0 },
  2: { limite: 80000, saldo: 0 },
  3: { limite: 1000000, saldo: 0 },
  4: { limite: 10000000, saldo: 0 },
  5: { limite: 500000, saldo: 0 },
};
const transacoes = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

app.get("/clientes/:id/extrato", (req, res) => {
  let client = clientes[req.params.id];
  if (!client) {
    res.status(404).send();
    return;
  }
  const now_dt = new Date().toISOString();
  res.send({
    saldo: {
      total: client.saldo,
      data_extrato: now_dt,
      limite: client.limite,
    },
    ultimas_transacoes: transacoes[req.params.id].slice(0, 19),
  });
});


app.post("/clientes/:id/transacoes", async (req, res) => {
  const id = req.params.id;
  let client = clientes[id];
  if (!client) {
    res.status(404).send();
    return;
  }
  let {valor, tipo, descricao} = req.body;
  if(!valor || !tipo || !descricao){
    res.status(422).send("missing data");
    return;
  }
  if (typeof valor !== "number") {
    res.status(422).send("invalid valor");
    return;
  }
  if (!Number.isInteger(valor)) {
    res.status(422).send("invalid valor: not integer");
    return;
  }
  if (typeof tipo !== "string"|| tipo.length != 1) {
    res.status(422).send("invalid tipo");
    return;
  }
  if (typeof descricao !== "string" || descricao.length > 10){
    res.status(422).send("invalid descricao");
    return;
  }

  let multiplier = 0
  if (tipo === 'c'){
    multiplier = 1;
  } else if ( tipo === 'd'){
    multiplier = -1;
  } else {
    res.status(422).send("Invalid tipo value");
    return;
  }
  if (client.saldo + multiplier*valor < -client.limite){
    res.status(422).send(`Invalid valor value ${client.saldo + multiplier*valor} < ${client.limite}`);
    res.status(422).send();
    return;
  }


  const random = Math.floor(Math.random() * 4) // 0 to 3
  await new Promise(resolve => setTimeout(resolve, random*1000)); // SIMULATE LONG CHECK
  client.saldo += multiplier*valor;
  transacoes[id] = [{valor: valor, tipo: tipo, descricao: descricao}].concat(transacoes[id])
  res.send({limite: client.limite, saldo: client.saldo});
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
