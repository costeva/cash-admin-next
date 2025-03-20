import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/authController";

describe("Authenticacion - Create Account", () => {
  it("Should diplay validation erros from is empty", async () => {
    const res = await request(server)
      .post("/api/v1/auth/create-account")
      .send({});
    const createMock = jest.spyOn(AuthController, "creatAccount");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(3);
    expect(res.status).not.toBe(201);
    expect(res.body.errors).not.toHaveLength(2);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("Should return 400 when the email is invalid", async () => {
    const res = await request(server).post("/api/v1/auth/create-account").send({
      name: "toto",
      email: "test",
      password: "password",
    });

    const createMock = jest.spyOn(AuthController, "creatAccount");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.status).not.toBe(201);
    expect(res.body.errors).not.toHaveLength(3);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("Should return 400 when the password is less than 8 characters ", async () => {
    const res = await request(server).post("/api/v1/auth/create-account").send({
      name: "toto",
      email: "toto@gmail.com",
      password: "short",
    });

    const createMock = jest.spyOn(AuthController, "creatAccount");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.status).not.toBe(201);
    expect(res.body.errors).not.toHaveLength(3);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("Should return 201 register new user", async () => {
    const res = await request(server).post("/api/v1/auth/create-account").send({
      name: "tute",
      email: "tute@gmail.com",
      password: "12345678",
    });

    expect(res.status).toBe(201);
    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });

  it("Should return 409 when use register duplicate", async () => {
    const res = await request(server).post("/api/v1/auth/create-account").send({
      name: "tute",
      email: "tute@gmail.com",
      password: "12345678",
    });

    expect(res.status).toBe(409);
    expect(res.status).not.toBe(201);
    expect(res.status).not.toBe(400);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Un usuario ya se registro con ese email");
    expect(res.body).not.toHaveProperty("errors");
  });
});
