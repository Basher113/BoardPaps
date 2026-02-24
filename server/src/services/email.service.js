const { Resend } = require('resend');
const { logInfo, logError, logWarn } = require('../lib/logger');
const { escapeHtml, escapeHtmlForEmail } = require('../utils/sanitize');

// Initialize Resend client - handle missing API key gracefully
const getEmailClient = () => {
  if (!process.env.RESEND_API_KEY) {
    logWarn('RESEND_API_KEY not configured - email sending is disabled');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const resend = getEmailClient();

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'BoardPaps <noreply@boardpaps.com>',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

/**
 * Check if email service is available
 * @returns {boolean}
 */
const isEmailEnabled = () => {
  return resend !== null;
};

/**
 * Send an invitation email to a new user
 * @param {Object} invitation - The invitation object from database
 * @param {Object} project - The project object
 * @param {Object} inviter - The user who sent the invitation
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendInvitationEmail = async (invitation, project, inviter) => {
  // Check if email is enabled
  if (!isEmailEnabled()) {
    logInfo('Email sending skipped - RESEND_API_KEY not configured', {
      invitationId: invitation.id,
      email: invitation.email
    });
    return { success: false, error: 'Email service not configured', skipped: true };
  }

  // Sanitize all user-provided content to prevent XSS
  const safeProjectName = escapeHtml(project.name);
  const safeInviterName = escapeHtml(inviter.username || inviter.email);
  const safeMessage = invitation.message ? escapeHtmlForEmail(invitation.message) : null;
  const safeRole = escapeHtml(invitation.role);
  
  const invitationUrl = `${EMAIL_CONFIG.frontendUrl}/invitations?token=${encodeURIComponent(invitation.token)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're invited to join ${safeProjectName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 700;">
                    You're Invited!
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    <strong style="color: #1a1a2e;">${safeInviterName}</strong> has invited you to join the project <strong style="color: #f16363;">${safeProjectName}</strong> on BoardPaps.
                  </p>
                  
                  ${safeMessage ? `
                    <div style="background-color: #f8f9fa; border-left: 4px solid #f16363; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                      <p style="margin: 0; color: #4a4a4a; font-size: 14px; font-style: italic;">
                        "${safeMessage}"
                      </p>
                    </div>
                  ` : ''}
                  
                  <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px;">
                    <strong>Role:</strong> <span style="text-transform: capitalize; background-color: ${invitation.role === 'ADMIN' ? '#fef3c7' : '#e0e7ff'}; color: ${invitation.role === 'ADMIN' ? '#92400e' : '#3730a3'}; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">${safeRole.toLowerCase()}</span>
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 14px;">
                    This invitation will expire in <strong>6 days</strong>.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${invitationUrl}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                          Accept Invitation
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-align: center;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0; color: #6366f1; font-size: 12px; word-break: break-all; text-align: center;">
                    ${invitationUrl}
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Brand Footer -->
            <table width="100%" style="max-width: 600px; margin-top: 20px;">
              <tr>
                <td style="text-align: center;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} BoardPaps. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                    If you didn't expect this invitation, you can safely ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
You're Invited to Join ${safeProjectName}!

${safeInviterName} has invited you to join the project "${safeProjectName}" on BoardPaps.

${safeMessage ? `Personal message: "${safeMessage}"\n` : ''}
Role: ${safeRole}
This invitation will expire in 6 days.

Accept your invitation: ${invitationUrl}

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} BoardPaps. All rights reserved.
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: invitation.email,
      subject: `You're invited to join ${safeProjectName} on BoardPaps`,
      html,
      text,
    });

    if (error) {
      logError('Failed to send invitation email', { 
        error: error.message, 
        invitationId: invitation.id,
        email: invitation.email 
      });
      return { success: false, error: error.message };
    }

    logInfo('Invitation email sent successfully', { 
      messageId: data.id, 
      invitationId: invitation.id,
      email: invitation.email 
    });
    
    return { success: true, messageId: data.id };
  } catch (err) {
    logError('Exception sending invitation email', { 
      error: err.message, 
      invitationId: invitation.id,
      email: invitation.email 
    });
    return { success: false, error: err.message };
  }
};

/**
 * Send a notification email when an invitation is accepted
 * @param {Object} invitation - The invitation object
 * @param {Object} project - The project object
 * @param {Object} inviter - The user who sent the invitation
 * @param {Object} newUser - The user who accepted the invitation
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendInvitationAcceptedEmail = async (invitation, project, inviter, newUser) => {
  // Check if email is enabled
  if (!isEmailEnabled()) {
    return { success: false, error: 'Email service not configured', skipped: true };
  }

  // Sanitize all user-provided content
  const safeProjectName = escapeHtml(project.name);
  const safeNewUserName = escapeHtml(newUser.username || newUser.email);
  const safeRole = escapeHtml(invitation.role);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation Accepted - ${safeProjectName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 700;">
                    Invitation Accepted! 🎉
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    <strong style="color: #1a1a2e;">${safeNewUserName}</strong> has accepted your invitation to join <strong style="color: #6366f1;">${safeProjectName}</strong>.
                  </p>
                  
                  <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px;">
                    <strong>Role:</strong> <span style="text-transform: capitalize;">${safeRole.toLowerCase()}</span>
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Brand Footer -->
            <table width="100%" style="max-width: 600px; margin-top: 20px;">
              <tr>
                <td style="text-align: center;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} BoardPaps. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Invitation Accepted!

${safeNewUserName} has accepted your invitation to join "${safeProjectName}".

Role: ${safeRole}

© ${new Date().getFullYear()} BoardPaps. All rights reserved.
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: inviter.email,
      subject: `${safeNewUserName} joined ${safeProjectName}`,
      html,
      text,
    });

    if (error) {
      logError('Failed to send invitation accepted email', { 
        error: error.message, 
        invitationId: invitation.id 
      });
      return { success: false, error: error.message };
    }

    logInfo('Invitation accepted email sent successfully', { 
      messageId: data.id, 
      invitationId: invitation.id 
    });
    
    return { success: true, messageId: data.id };
  } catch (err) {
    logError('Exception sending invitation accepted email', { 
      error: err.message, 
      invitationId: invitation.id 
    });
    return { success: false, error: err.message };
  }
};

/**
 * Send a notification when an invitation is declined
 * @param {Object} invitation - The invitation object
 * @param {Object} project - The project object
 * @param {Object} inviter - The user who sent the invitation
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendInvitationDeclinedEmail = async (invitation, project, inviter) => {
  // Check if email is enabled
  if (!isEmailEnabled()) {
    return { success: false, error: 'Email service not configured', skipped: true };
  }

  // Sanitize all user-provided content
  const safeProjectName = escapeHtml(project.name);
  const safeEmail = escapeHtml(invitation.email);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation Declined - ${safeProjectName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: 700;">
                    Invitation Declined
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    Your invitation to <strong style="color: #1a1a2e;">${safeEmail}</strong> to join <strong style="color: #6366f1;">${safeProjectName}</strong> was declined.
                  </p>
                </td>
              </tr>
            </table>
            
            <!-- Brand Footer -->
            <table width="100%" style="max-width: 600px; margin-top: 20px;">
              <tr>
                <td style="text-align: center;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} BoardPaps. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
Invitation Declined

Your invitation to ${safeEmail} to join "${safeProjectName}" was declined.

© ${new Date().getFullYear()} BoardPaps. All rights reserved.
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: inviter.email,
      subject: `Invitation to ${safeProjectName} was declined`,
      html,
      text,
    });

    if (error) {
      logError('Failed to send invitation declined email', { 
        error: error.message, 
        invitationId: invitation.id 
      });
      return { success: false, error: error.message };
    }

    logInfo('Invitation declined email sent successfully', { 
      messageId: data.id, 
      invitationId: invitation.id 
    });
    
    return { success: true, messageId: data.id };
  } catch (err) {
    logError('Exception sending invitation declined email', { 
      error: err.message, 
      invitationId: invitation.id 
    });
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendInvitationEmail,
  sendInvitationAcceptedEmail,
  sendInvitationDeclinedEmail,
  isEmailEnabled,
};
