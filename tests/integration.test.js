const request = require("supertest");
const { app, DebrisModel, resetDatabase } = require("../app");

describe("Pruebas de Integración", () => {
  beforeEach(() => resetDatabase());

  test("11. (Top-Down) GET /api/debris retorna 200", async () => {
    const res = await request(app).get("/api/debris");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("12. (Top-Down) POST /api/debris persiste y retorna 201", async () => {
    const res = await request(app)
      .post("/api/debris")
      .send({ name: "Batería", size: 12 });
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(3);
  });

  test("13. (Top-Down) DELETE /api/debris/:id retorna 204", async () => {
    const res = await request(app).delete("/api/debris/1");
    expect(res.statusCode).toBe(204);
  });

  test("14. (Bottom-Up) Agregar en DebrisModel afecta al GET HTTP", async () => {
    DebrisModel.add({ name: "Fuselaje", size: 50 });
    const res = await request(app).get("/api/debris");
    expect(res.body.length).toBe(3);
  });

  test("15. (Bottom-Up) Eliminar en DebrisModel afecta al GET HTTP", async () => {
    DebrisModel.remove(2);
    const res = await request(app).get("/api/debris");
    expect(res.body.length).toBe(1);
  });

  test("16. (Bottom-Up) POST HTTP se refleja en DebrisModel", async () => {
    await request(app).post("/api/debris").send({ name: "Lente", size: 0.2 });
    expect(DebrisModel.getAll().some((d) => d.name === "Lente")).toBe(true);
  });

  test("17. (Big Bang) Flujo: POST -> GET -> DELETE -> GET", async () => {
    const post = await request(app)
      .post("/api/debris")
      .send({ name: "Satélite", size: 200 });
    await request(app).delete(`/api/debris/${post.body.id}`);
    const get = await request(app).get("/api/debris");
    expect(get.body.length).toBe(2);
  });

  test("18. (Big Bang) Múltiples inserciones", async () => {
    await request(app).post("/api/debris").send({ name: "A", size: 1 });
    await request(app).post("/api/debris").send({ name: "B", size: 2 });
    const get = await request(app).get("/api/debris");
    expect(get.body.length).toBe(4);
  });

  test("19. (Big Bang) POST inválido no corrompe la DB", async () => {
    await request(app).post("/api/debris").send({});
    const get = await request(app).get("/api/debris");
    expect(get.body.length).toBe(2);
  });
});
