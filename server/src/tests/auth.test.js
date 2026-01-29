const request = require("supertest");
const app = require("../app");
const prisma = require("../lib/prisma");

const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const bcrypt = require("bcryptjs");



describe("Auth Controllers (Integration)", () => {

  let agent

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
   
    agent = request.agent(app);

  });


  describe("POST /auth/register", () => {
    it("registers a new user", async () => {
      const res = await agent.post("/auth/register").send({
        email: "test@test.com",
        username: "testuser",
        password: "password123",
        confirmPassword: "password123"
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registered successfully");

      const user = await prisma.user.findUnique({
        where: { email: "test@test.com" },
      });

      expect(user).toBeTruthy();
      expect(user.username).toBe("testuser");
    });

    it("rejects duplicate email", async () => {
      await prisma.user.create({
        data: {
          email: "dup@test.com",
          username: "user1",
          password: "hashed",
          
        },
      });

      const res = await agent.post("/auth/register").send({
        email: "dup@test.com",
        username: "user2",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors.email).toContain("Email Already Taken");
    });

    it("rejects duplicate username", async () => {
      await prisma.user.create({
        data: {
          email: "user@test.com",
          username: "dupname",
          password: "hashed",
        },
      });

      const res = await agent.post("/auth/register").send({
        email: "new@test.com",
        username: "dupname",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors.username).toContain("Username Already Taken");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      const hashed = await bcrypt.hash("password123", 10);

      await prisma.user.create({
        data: {
          email: "login@test.com",
          username: "loginuser",
          password: hashed,
        },
      });
    });

    it("logs in with valid credentials and sets cookies", async () => {
      const res = await agent.post("/auth/login").send({
        email: "login@test.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();

      const cookies = res.headers["set-cookie"].join("");
      expect(cookies).toContain("accessToken");
      expect(cookies).toContain("refreshToken");
    });

    it("rejects invalid credentials", async () => {
      const res = await agent.post("/auth/login").send({
        email: "login@test.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid Credentials");
    });
  });

  describe("POST /auth/logout", () => {
    it("revokes refresh token and clears cookies", async () => {
      const hashed = await bcrypt.hash("password123", 10);
      const user = await prisma.user.create({
        data: {
          email: "logout@test.com",
          username: "logoutuser",
          password: hashed,
        },
      });

      await agent.post("/auth/login").send({ email: "logout@test.com", password: "password123" });

      const refreshToken = await prisma.refreshToken.findFirst(); // after login


      const res = await agent.post("/auth/logout")
        

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");

      // ASSERT COOKIES WERE CLEARED
      const cookies = res.headers["set-cookie"].join("");
      expect(cookies).toMatch(/accessToken=;/);
      expect(cookies).toMatch(/refreshToken=;/);

      const stored = await prisma.refreshToken.findUnique({
        where: { token: refreshToken.token },
      });

      expect(stored.revoked).toBe(true);
    });
  });

  describe("POST /auth/refresh-token", () => {
    it("issues a new access token for a valid refresh token", async () => {
     
      const user = await prisma.user.create({
        data: {
          email: "refresh@test.com",
          username: "refreshuser",
          password: "hashed",
        },
      });

      const refreshToken = jwt.sign(
        { userId: user.id },
        authConfig.refresh_secret,
        { expiresIn: authConfig.refresh_expires }
      );

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      const res = await agent
        .post("/auth/refreshToken")
        .set("Cookie", `refreshToken=${refreshToken}`);

      expect(res.statusCode).toBe(200);

      const cookies = res.headers["set-cookie"].join("");
      expect(cookies).toContain("accessToken");
    });

    it("rejects revoked refresh tokens", async () => {
      const user = await prisma.user.create({
        data: {
          email: "revoked@test.com",
          username: "revokeduser",
          password: "hashed",
        },
      });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: "revoked-token",
          revoked: true,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      const res = await agent
        .post("/auth/refreshToken")
        .set("Cookie", "refreshToken=revoked-token")

      expect(res.statusCode).toBe(403);
    });
  });
});
