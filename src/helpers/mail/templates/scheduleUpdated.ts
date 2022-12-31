import button from '../components/button';

export default ({ week }: { week: number | string }) => `<p>
    Your schedule for <strong>week ${week}</strong> has been updated. Please visit Spark to review and accept your shifts.
  </p>
  ${button({
    text: 'Review shifts',
  })}`;
