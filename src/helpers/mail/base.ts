export default ({ firstName, body, sender = 'The Planning team' }: { firstName: string, body: string, sender?: string }) => `<div
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
    <p>
      Hi ${firstName},
    </p>
    ${body}
    <p>
      Kind regards,<br />
      ${sender}
    </p>
  </div>
</div>`;
