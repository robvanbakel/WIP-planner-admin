const button = ({ link = 'https://app.sparkscheduler.com', text = 'Go to Spark', options = {} } = {}) => {
  let html = `<a
  style="
    display: block;
    width: min-content;
    white-space: nowrap;
    margin: ${options.showCopyPasteLink ? '24px 0 0' : '24px 0'};
    padding: 10px 18px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
    background-color: #413659;
    border-radius: 99px;
  "
  href="${link}"
  >${text}</a
>
`;

  if (options.showCopyPasteLink) {
    html += `<p style="font-size: 12px; margin-bottom: 24px">
  <i
    >Alternatively, you can copy and paste this link in your browser:
    <a style="color: #413659" href="${link}"
      >${link}</a
    ></i
  >
</p>`;
  }

  return html;
};

module.exports = button;
