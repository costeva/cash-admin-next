import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/authController";
import e from "express";
import User from "../../models/Users";
import * as authUtils from "../../utils/auth";
import * as jwtUtils from "../../utils/jwt";
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

describe("Authenticacion - Account confirmation token if is empty oo tkon is valid", () => {
  it("Should display error if token empty", async () => {
    const res = await request(server)
      .post("/api/v1/auth/confirm-account")
      .send({
        token: "not_valid",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("Token no es valido");
  });

  it("Should confirm account with a valid token ", async () => {
    const token = globalThis.cashTrackrConfirmationToken;
    const res = await request(server)
      .post("/api/v1/auth/confirm-account")
      .send({
        token: token,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cuenta confirmada");
    expect(res.status).not.toBe(400);
  });
});

describe("Authenticacion - Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Should display validation errors when the form is empty", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({});

    const loginMock = jest.spyOn(AuthController, "login");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(2);
    expect(res.body.errors).not.toHaveLength(1);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("Should return 400 bad resquest when the email is invalid", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: "test",
      password: "password",
    });

    const loginMock = jest.spyOn(AuthController, "login");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors).not.toHaveLength(2);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("Should return 400 bad resquest when the email is invalid", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: "test",
      password: "password",
    });

    const loginMock = jest.spyOn(AuthController, "login");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors).not.toHaveLength(2);
    expect(loginMock).not.toHaveBeenCalled();
  });
  it("Should return 400 error if the user is not found", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Usuario no encontrado");
    expect(res.status).not.toBe(200);
  });

  it("Should return 403 error if the user is not confirmed", async () => {
    (jest.spyOn(User, "findOne") as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: false,
      password: "password",
      email: "test@gmail.com",
    });

    const res = await request(server).post("/api/v1/auth/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("La cuenta no ha sido confirmada");
    expect(res.status).not.toBe(200);
  });

  it("Should return 403 error if the user account is not confirmed", async () => {
    const userData = {
      name: "test",
      email: "test@gmail.com",
      password: "password",
    };

    await request(server).post("/api/v1/auth/create-account").send(userData);

    const res = await request(server).post("/api/v1/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("La cuenta no ha sido confirmada");
    expect(res.status).not.toBe(200);
  });

  it("Should return 400 error if the password is incorrect", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "passwordhash",
    });

    const comparePassword = jest
      .spyOn(authUtils, "comparePassword")
      .mockResolvedValue(false);
    const res = await request(server).post("/api/v1/auth/login").send({
      email: "tute@gmail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Password incorrecto");
    expect(res.status).not.toBe(200);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(comparePassword).toHaveBeenCalledTimes(1);
  });

  it("Should return 400 error if the password is incorrect", async () => {
    const findOne = (
      jest.spyOn(User, "findOne") as jest.Mock
    ).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: "passwordhash",
    });

    const comparePassword = jest
      .spyOn(authUtils, "comparePassword")
      .mockResolvedValue(true);

    const generateJwt = jest
      .spyOn(jwtUtils, "generateJwt")
      .mockReturnValue("token");

    const res = await request(server).post("/api/v1/auth/login").send({
      email: "tute@gmail.com",
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual("token");
    expect(res.status).not.toBe(401);
    expect(findOne).toHaveBeenCalledTimes(1);

    expect(comparePassword).toHaveBeenCalledTimes(1);
    expect(comparePassword).toHaveBeenCalledWith("password", "passwordhash");

    expect(generateJwt).toHaveBeenCalledTimes(1);
    expect(generateJwt).toHaveBeenCalledWith(1);
  });
});

describe("Get /api/budget", () => {
  let jwt: string;
  beforeAll(async () => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: "tute@gmail.com",
      password: "12345678",
    });
    jwt = res.body;
  });
  it("Should reject unauthenticatd access to budgets without a jwt", async () => {
    const res = await request(server).get("/api/v1/budgets");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("No autorizado");
  });

  it("Should reject unauthenticatd access to budgets with an invalid jwt", async () => {
    const res = await request(server)
      .get("/api/v1/budgets")
      .auth(jwt, { type: "bearer" });
    /*   expect(res.body).toHaveLength(0); */
    expect(res.status).not.toBe(401);
    expect(res.body.message).not.toBe("No autorizado");
  });

  it("Should reject unauthenticatd access to budgets without a valid jwt", async () => {
    const res = await request(server).get("/api/v1/budgets");
    expect(res.status).toBe(401);

    expect(res.body.message).toBe("No autorizado");
  });
});

describe("Post /api/budget", () => {
  let jwt: string;
  beforeAll(async () => {
    jest.resetAllMocks();
  });

  beforeAll(async () => {
    const res = await request(server).post("/api/v1/auth/login").send({
      email: "tute@gmail.com",
      password: "12345678",
    });
    jwt = res.body;
  });
  it("Should reject unauthenticatd post request to budgets without a jwt", async () => {
    const res = await request(server).post("/api/v1/budgets");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No autorizado");
  });
});
