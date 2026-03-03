const { z } = require("zod");

/**
 * Transform email to lowercase and trim whitespace
 */
const emailTransform = z.string()
  .email("Invalid email address")
  .transform((val) => val.toLowerCase().trim());

const invitationSchema = z.object({
  email: emailTransform,
  role: z.enum(["ADMIN", "MEMBER"], {
    errorMap: () => ({ message: "Role must be ADMIN or MEMBER" }),
  }),
  message: z.string()
    .max(250, "Message must be 250 characters or less")
    .optional(),
});

module.exports = { invitationSchema };
