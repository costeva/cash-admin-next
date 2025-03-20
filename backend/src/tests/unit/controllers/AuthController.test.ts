import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/authController";
import User from "../../../models/Users";
import { comparePassword, hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJwt } from "../../../utils/jwt";

jest.mock("../../../models/Users");
jest.mock("../../../utils/auth");
jest.mock("../../../utils/token");
jest.mock("../../../utils/jwt");
describe("AuthController.createAccount", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 409 if user already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);

    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "toto@gmail.com",
        password: "password",
      },
    });
    const res = createResponse();
    await AuthController.creatAccount(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(409);
    expect(data).toStrictEqual({
      message: "Un usuario ya se registro con ese email",
    });
    expect(User.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  it("should register a newuser and return a succes messages", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "toto@gmail.com",
        password: "password",
        name: "Toto",
      },
    });
    const res = createResponse();
    const userMock = {
      ...req.body,
      save: jest.fn(),
    };

    (User.create as jest.Mock).mockResolvedValue(userMock);
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (generateToken as jest.Mock).mockReturnValue("123456");
    jest
      .spyOn(AuthEmail, "sendConfirmationEmail")
      .mockImplementation(() => Promise.resolve());

    await AuthController.creatAccount(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);

    expect(data).toHaveProperty("message", "Cuenta creada");
    expect(data).toHaveProperty("user");
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(userMock.password).toBe("hashedPassword");
    expect(userMock.token).toBe("123456");
    expect(userMock.save).toHaveBeenCalledTimes(1);
    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(generateToken).toHaveBeenCalledTimes(1);
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: "Toto",
      email: "toto@gmail.com",
      token: "123456",
    });
  });
});

describe("AuthController.login", () => {
  it("should return 404 if user does not exist", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "toto@gmail.com",
        password: "password",
      },
    });

    const res = createResponse();
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data).toStrictEqual({ message: "Usuario no encontrado" });
  });

  it("should return 403 if user is not confirmed", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "toto@gmail.com",
      password: "password",
      confirmed: false,
    });
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "toto@gmail.com",
        password: "password",
      },
    });

    const res = createResponse();
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(403);
    expect(data).toStrictEqual({ message: "La cuenta no ha sido confirmada" });
  });

  it("should return 401 if the password is incorrect ", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "toto@gmail.com",
      password: "password",
      confirmed: true,
    });
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "toto@gmail.com",
        password: "password",
      },
    });

    const res = createResponse();
    (comparePassword as jest.Mock).mockResolvedValue(false);
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(401);
    expect(data).toStrictEqual({ message: "Password incorrecto" });
    expect(comparePassword).toHaveBeenCalledTimes(1);
    expect(comparePassword).toHaveBeenCalledWith("password", "password");
  });

  it("should return a JWT if authentication is successful ", async () => {
    const userMock = {
      id: 1,
      email: "toto@gmail.com",
      password: "password",
      confirmed: true,
    };

    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "toto@gmail.com",
        password: "password",
      },
    });

    const res = createResponse();
    const fakejwt = "fake_jwt";

    (User.findOne as jest.Mock).mockResolvedValue(userMock);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (generateJwt as jest.Mock).mockReturnValue(fakejwt);

    await AuthController.login(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(fakejwt);
    expect(generateJwt).toHaveBeenCalledTimes(1);
    expect(generateJwt).toHaveBeenCalledWith(1);
  });
});
