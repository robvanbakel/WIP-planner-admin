import dayjs from '../../../dayjs';
import button from '../components/button';

export default ({ from }: { from: string }) => `<p>
    Your shift for <strong>${dayjs(from).format('LLL')}</strong> has been cancelled. Click on the button below to see your updated schedule.
  </p>
  ${button()}
  <p>
    If you believe a mistake has been made, please let us know by replying to this email.
  </p>`;
