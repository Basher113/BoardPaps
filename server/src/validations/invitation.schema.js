const { z } = require("zod");

const invitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER"], {
    errorMap: () => ({ message: "Role must be ADMIN or MEMBER" }),
  }),
});

module.exports = { invitationSchema };
