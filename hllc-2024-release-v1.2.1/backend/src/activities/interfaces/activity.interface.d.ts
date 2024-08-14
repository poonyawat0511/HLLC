import { Activity } from '../schemas/activities.schema';

export type ActivityProgress =
  | { step: 0; message: 'not started' | 'closing' }
  | { step: 1; message: 'waiting' | 'failed' }
  | { step: 2; message: 'waiting' }
  | { step: 3; message: 'waiting' | 'success' };

export interface UserActivity extends Activity {
  open: any;
  status: ActivityProgress;
  checkInAt?: Date | null;
  takeAssessmentAt?: Evaluation | null;
  location: { th: string; en: string };
  dateTime: { start: Date | null; end: Date | null };
}
