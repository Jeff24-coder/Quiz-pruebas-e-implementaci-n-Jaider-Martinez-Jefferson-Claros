const { DebrisModel, DebrisService, resetDatabase } = require("../app");

describe("Pruebas Unitarias", () => {
  beforeEach(() => resetDatabase());

  test("1. DebrisModel.remove elimina el objeto indicado", () => {
    DebrisModel.remove(1);
    expect(DebrisModel.getAll().find((d) => d.id === 1)).toBeUndefined();
  });

  test("2. DebrisModel.remove no altera los demás objetos", () => {
    DebrisModel.remove(1);
    expect(DebrisModel.getAll()[0].id).toBe(2);
    expect(DebrisModel.getAll().length).toBe(1);
  });

  test("3. DebrisModel.add valida que name sea string", () => {
    expect(() => DebrisModel.add({ name: 123, size: 5 })).toThrow();
  });

  test("4. DebrisModel.add valida que size sea number", () => {
    expect(() => DebrisModel.add({ name: "Chasis", size: "grande" })).toThrow();
  });

  test("5. DebrisModel.add incrementa el ID", () => {
    const res = DebrisModel.add({ name: "Antena", size: 2 });
    expect(res.id).toBe(3);
  });

  test("6. DebrisModel.getAll devuelve el array en memoria", () => {
    expect(DebrisModel.getAll().length).toBe(2);
  });

  test("7. DebrisModel.remove retorna false si no encuentra el ID", () => {
    expect(DebrisModel.remove(99)).toBe(false);
  });

  test("8. DebrisService.reportDebris exige nombre", () => {
    expect(() => DebrisService.reportDebris({ size: 10 })).toThrow(
      "Nombre requerido",
    );
  });

  test("9. DebrisService.reportDebris exige tamaño", () => {
    expect(() => DebrisService.reportDebris({ name: "Cable" })).toThrow(
      "Tamaño requerido",
    );
  });

  test("10. DebrisService.collectDebris transforma string a entero", () => {
    DebrisService.collectDebris("2");
    expect(DebrisModel.getAll().length).toBe(1);
  });
});
