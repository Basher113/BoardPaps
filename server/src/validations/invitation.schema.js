const { z } = require("zod");

/**
 * Transform email to lowercase and trim whitespace
 */
const emailTransform = z.email("Invalid email address")
  .transform((val) => val.toLowerCase().trim());

const invitationSchema = z.object({
  email: emailTransform,
  role: z.enum(["ADMIN", "MEMBER"], {
    errorMap: () => ({ message: "Role must be ADMIN or MEMBER" }),
  }),
});

/**
 * Schema for bulk invitations
 * Limited to 5 invitations per request for security
 */
const bulkInvitationSchema = z.object({
  invitations: z.array(
    z.object({
      email: emailTransform,
      role: z.enum(["ADMIN", "MEMBER"], {
        errorMap: () => ({ message: "Role must be ADMIN or MEMBER" }),
      }),
    })
  ).min(1, "At least one invitation is required").max(5, "Maximum 5 invitations per request"),
});

module.exports = { invitationSchema, bulkInvitationSchema };
