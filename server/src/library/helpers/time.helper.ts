import * as time from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

time.extend(timezone);
time.extend(utc);

export { time };
