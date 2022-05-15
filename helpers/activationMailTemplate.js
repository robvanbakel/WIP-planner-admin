const activationMailTemplate = ({ activationLink, firstName }) => `<div style="font-family: Roboto, sans-serif; color: #635d6d; font-size: 14px; line-height: 1.5">
<div style="margin: 0 auto; max-width: 650px; padding: 20px 40px; border: 1px solid #deddde; border-radius: 20px">
  <p>Hi ${firstName},</p>
  <p>
    Welcome to our team! A new account has been made for you, click the button below to create a password and activate your account.
  </p>
  <a
    style="
      display: block;
      width: min-content;
      white-space: nowrap;
      margin: 24px 0 0;
      padding: 10px 18px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      color: #fff;
      background-color: #413659;
      border-radius: 99px;
    "
    href="${activationLink}"
    >Activate Account</a
  >
  <p style="font-size: 12px; margin-bottom: 24px">
    <i
      >Alternatively, you can copy and paste this link in your browser:
      <a style="color: #413659" href="${activationLink}">${activationLink}</a></i
    >
  </p>
  <p>After activating your account, you'll be able to log in and see your schedule.</p>
  <p>
    Kind regards,<br />
    The Planning team
  </p>
</div>
</div>`;

module.exports = activationMailTemplate;
