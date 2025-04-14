const express = require("express");
const exphbs = require("express-handlebars");
const db = require("./firebase");

const {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where
} = require("firebase/firestore");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home
app.get("/", async (req, res) => {
  try {
    const tarefasRef = collection(db, "tarefas");
    const snapshot = await getDocs(tarefasRef);
    const tarefas = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    const tarefasAtivas = tarefas.filter((t) => !t.completa);
    const quantidadeTarefasAtivas = tarefasAtivas.length;

    res.render("home", { tarefas, quantidadeTarefasAtivas });
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao buscar tarefas.");
  }
});

// Criar
app.post("/criar", async (req, res) => {
  try {
    await addDoc(collection(db, "tarefas"), {
      descricao: req.body.descricao,
      completa: false
    });
    res.redirect("/");
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao criar tarefa.");
  }
});

// Excluir
app.post("/excluir", async (req, res) => {
  try {
    await deleteDoc(doc(db, "tarefas", req.body.id));
    res.redirect("/");
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao excluir tarefa.");
  }
});

// Completar
app.post("/completar", async (req, res) => {
  try {
    await updateDoc(doc(db, "tarefas", req.body.id), {
      completa: true
    });
    res.redirect("/");
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao completar tarefa.");
  }
});

// Descompletar
app.post("/descompletar", async (req, res) => {
  try {
    await updateDoc(doc(db, "tarefas", req.body.id), {
      completa: false
    });
    res.redirect("/");
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao descompletar tarefa.");
  }
});

// Limpar todas
app.get("/Limpartarefas", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "tarefas"));
    const deletions = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "tarefas", docSnap.id))
    );
    await Promise.all(deletions);
    res.redirect("/");
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao limpar tarefas.");
  }
});

// Completas
app.get("/completas", async (req, res) => {
  try {
    const q = query(collection(db, "tarefas"), where("completa", "==", true));
    const snapshot = await getDocs(q);
    const tarefas = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    res.render("completas", {
      tarefas,
      quantidadeTarefas: tarefas.length
    });
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao buscar tarefas completas.");
  }
});

// Ativas
app.get("/ativas", async (req, res) => {
  try {
    const q = query(collection(db, "tarefas"), where("completa", "==", false));
    const snapshot = await getDocs(q);
    const tarefas = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    res.render("ativas", {
      tarefas,
      quantidadeTarefas: tarefas.length
    });
  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao buscar tarefas ativas.");
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000!");
});
