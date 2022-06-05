const general = (html) => `<div
style="
  font-family: Roboto, sans-serif;
  color: #635d6d;
  font-size: 14px;
  line-height: 1.5;
">
<div
  style="
    margin: 0 auto;
    max-width: 650px;
    padding: 20px 40px;
    border: 1px solid #deddde;
    border-radius: 20px;
  ">
    ${html}
  </div>
</div>`;

module.exports = general;
