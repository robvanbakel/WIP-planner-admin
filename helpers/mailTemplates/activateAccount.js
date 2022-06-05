const activateAccount = ({ activationToken }) => {
  const activationLink = `https://app.sparkscheduler.com/auth?activationToken=${activationToken}`;

  return `<p>
    Welcome to our team! A new account has been made for you, click the
    button below to create a password and activate your account.
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
      <a style="color: #413659" href="${activationLink}"
        >${activationLink}</a
      ></i
    >
  </p>
  <p>
    After activating your account, you'll be able to log in and see your
    schedule.
  </p>`;
};

module.exports = activateAccount;
