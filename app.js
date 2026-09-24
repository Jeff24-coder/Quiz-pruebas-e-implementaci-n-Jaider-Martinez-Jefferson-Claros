const express = require("express");
const app = express();
app.use(express.json());

let orbitalDebris = [
  { id: 1, name: "Panel Solar Roto", size: 15 },
  { id: 2, name: "Tornillo", size: 0.5 },
];

const resetDatabase = () => {
  orbitalDebris = [
    { id: 1, name: "Panel Solar Roto", size: 15 },
    { id: 2, name: "Tornillo", size: 0.5 },
  ];
};

const DebrisModel = {
  getAll: () => orbitalDebris,
  add: (debris) => {
    if (typeof debris.name !== "string" || typeof debris.size !== "number") {
      throw new Error("Validación de tipos fallida");
    }
    const nextId =
      orbitalDebris.length > 0
        ? Math.max(...orbitalDebris.map((d) => d.id)) + 1
        : 1;
    const newObj = { id: nextId, ...debris };
    orbitalDebris.push(newObj);
    return newObj;
  },
  remove: (id) => {
    const index = orbitalDebris.findIndex((item) => item.id === id);
    if (index === -1) return false;
    orbitalDebris.splice(index, 1);
    return true;
  },
};

const DebrisService = {
  reportDebris: (data) => {
    if (!data.name) throw new Error("Nombre requerido");

    if (data.size === undefined || data.size === null)
      throw new Error("Tamaño requerido");

    return DebrisModel.add(data);
  },
  collectDebris: (id) => {
    return DebrisModel.remove(parseInt(id, 10));
  },
};

const DebrisController = {
  getList: (req, res) => res.json(DebrisModel.getAll()),
  postDebris: (req, res) => {
    try {
      res.status(201).json(DebrisService.reportDebris(req.body));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteDebris: (req, res) => {
    DebrisService.collectDebris(req.params.id);
    res.status(204).send();
  },
};

app.get("/api/debris", DebrisController.getList);
app.post("/api/debris", DebrisController.postDebris);
app.delete("/api/debris/:id", DebrisController.deleteDebris);

// BLOQUE AGREGADO PARA INICIAR EL SERVIDOR
const PORT = 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = { app, DebrisModel, DebrisService, resetDatabase };
