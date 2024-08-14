import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';
import { AssessmentSection } from 'src/assessment-sections/schemas/assessment-section.schema';
import {
  AssessmentStatus,
  AssessmentType,
} from 'src/assessments/enums/assessment-status.enum';
import { Assessment } from 'src/assessments/schemas/assessments.schema';
import { CheckIn } from 'src/check-ins/schemas/check-ins.schema';
import { ContestVote } from 'src/contests/schemas/contest-vote.schema';
import { Evaluation } from 'src/evaluations/schemas/evaluation.schema';
import { Major } from 'src/majors/schemas/major.schema';
import { Posttest } from 'src/posttests/schemas/posttest.schema';
import { Pretest } from 'src/pretests/schemas/pretest.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Activity.name) private readonly activityModel: Model<Activity>,
    @InjectModel(CheckIn.name) private readonly checkInModel: Model<CheckIn>,
    @InjectModel(Evaluation.name)
    private readonly evaluationModel: Model<Evaluation>,
    @InjectModel(Major.name) private readonly majorModel: Model<Major>,
    @InjectModel(AssessmentSection.name)
    private readonly assessmentSectionModel: Model<AssessmentSection>,
    @InjectModel(Assessment.name)
    private readonly assessmentModel: Model<Assessment>,
    @InjectModel(Pretest.name)
    private readonly pretestModel: Model<Pretest>,
    @InjectModel(Posttest.name)
    private readonly posttestModel: Model<Posttest>,
    @InjectModel(ContestVote.name)
    private readonly contestVoteModel: Model<ContestVote>,
  ) {}

  async getUserProgress(filter: any) {
    const query = {};
    if (filter.school) {
      const majors = await this.majorModel
        .find({
          school: Array.isArray(filter.school)
            ? { $in: filter.school }
            : filter.school,
        })
        .select('_id')
        .lean();
      query['major'] = { $in: majors.map((major) => major._id) };
    }

    if (filter.major && !filter.school) {
      query['major'] = Array.isArray(filter.major)
        ? { $in: filter.major }
        : filter.major;
    }

    if (filter.user && !filter.major && !filter.school) {
      query['user'] = Array.isArray(filter.user)
        ? { $in: filter.user }
        : filter.user;
    }

    // Get all system users
    const users = await this.userModel
      .find(query)
      .select(['_id', 'name', 'username', 'major', 'type', 'round', 'password'])
      .populate({
        path: 'major',
        select: '_id name',
        populate: { path: 'school', select: '_id name' },
      })
      .lean();
    const userIds = users.map((user) => user._id);

    // Get activities
    const activities = await this.activityModel
      .find()
      .select(['_id', 'name', 'code', 'open', 'progress'])
      .lean();
    const activityIds = activities.map((activity) => activity._id);

    // Get checkIns
    const checkIns = await this.checkInModel
      .find({ user: { $in: userIds }, activity: { $in: activityIds } })
      .lean();
    const checkInMap = new Map(
      checkIns.map((checkIn) => [
        `${checkIn.user.toString()}:${checkIn.activity.toString()}`,
        true,
      ]),
    );

    // Get contest vote
    const contestVotes = await this.contestVoteModel
      .find({
        author: { $in: userIds },
        current: { $ne: null },
      })
      .lean();
    const contestMap = new Map(
      contestVotes.map((vote) => [vote.author.toString(), true]),
    );

    // Get posttests
    const posttests = await this.posttestModel
      .find({ author: { $in: userIds } })
      .lean();
    const posttestMap = new Map(
      posttests.map((posttest) => [posttest.author.toString(), true]),
    );

    // Get evaluations
    const evaluations = await this.evaluationModel
      .find({ author: { $in: userIds }, activity: { $in: activityIds } })
      .lean();
    const evaluationMap = new Map(
      evaluations.map((evaluation) => [
        `${evaluation.author.toString()}:${evaluation.activity.toString()}`,
        true,
      ]),
    );

    return users
      .map(({ password, ...user }) => ({
        ...user,
        isLoggedIn: !!password,
        vote: +contestMap.has(user._id.toString()),
        posttest: +posttestMap.has(user._id.toString()),
        activities: activities.map((activity) => {
          const key = `${user._id.toString()}:${activity._id.toString()}`;
          const status = (() => {
            if (evaluationMap.has(key)) return 2;
            if (checkInMap.has(key)) return 1;
            return 0;
          })();
          return { ...activity, status };
        }),
      }))
      .map((item) => {
        const countedActivities = item.activities.filter(
          (activity) => activity.progress,
        );
        const completedActivities = countedActivities.filter(
          (activity) => activity.status === 2,
        );
        const progress =
          (completedActivities.length / countedActivities.length) * 100;
        return { ...item, progress };
      });
  }

  async getAssessmentSummary(
    status: AssessmentStatus.pretest | AssessmentStatus.posttest,
  ) {
    // Fetch all assessments by status
    const assessments = await this.assessmentModel.find({ status }).lean();
    const assessmentsMap = new Map(
      assessments.map((assessment) => [assessment._id.toString(), assessment]),
    );

    // Map assessment section ids to set
    const sectionIdsSet = new Set(
      assessments
        .filter((assessment) => assessment.section)
        .map((assessment) => assessment.section.toString()),
    );

    // Search sections from section ids
    const sections = await this.assessmentSectionModel
      .find({
        _id: { $in: Array.from(sectionIdsSet.values()) },
      })
      .sort({ order: 1 })
      .lean();

    // Prepare table values
    // Get users
    const users = await this.userModel
      .find()
      .select(['_id', 'name', 'username', 'major', 'type', 'round', 'password'])
      .populate({
        path: 'major',
        select: '_id name',
        populate: { path: 'school', select: '_id name' },
      })
      .lean();
    const userIds = users.map((user) => user._id);

    // Get answers
    const answers = await this.posttestModel
      .find({ author: { $in: userIds } })
      .lean();
    const answersMap = new Map(
      answers.map((answer) => [answer.author.toString(), answer]),
    );

    // Merge answers to the users
    for (const user of users) {
      const answer = answersMap.get(user._id.toString());
      if (!answer) {
        user['assessment'] = false;
        continue;
      } else {
        user['assessment'] = true;
      }
      answer.values.forEach((value) => {
        const assessmentId = value.assessment.toString();
        const assessment = assessmentsMap.get(assessmentId);
        if (!assessment) return;
        switch (assessment.type) {
          case AssessmentType.ratings:
            const number = parseInt(value.value);
            if (!isNaN(number)) {
              user[assessmentId] = number;
            } else {
              user[assessmentId] = null;
            }
            break;
          case AssessmentType.text:
            if (typeof value.value === 'string') {
              user[assessmentId] = value.value;
            } else {
              user[assessmentId] = null;
            }
        }
      });
    }

    // Prepare object to assign section's children
    const sectionObj = Object.fromEntries([
      ...sections.map((section) => [section._id.toString(), []]),
      ['other', []],
    ]);

    // Push children to section object
    for (const assessment of assessments) {
      const section = assessment.section?.toString() ?? 'other';
      const assessmentId = assessment._id.toString();
      const average = users
        .filter((user) => user[assessmentId])
        .reduce((acc, curr, i) => {
          const value = curr[assessmentId];
          if (i === 0) return value;
          return (acc + value) / 2;
        }, 0);
      sectionObj[section].push({
        title: assessment.question.en,
        value: assessmentId,
        average,
      });
    }

    // Prepare table headers
    const headers = sections.map((section) => ({
      title: section.title.en,
      children: sectionObj[section._id.toString()],
    }));
    headers.push({ title: 'other', children: sectionObj['other'] });

    return {
      headers,
      values: users.map(({ password, ...user }) => ({
        ...user,
        isLoggedIn: !!password,
      })),
    };
  }

  async getEvaluationsSummary() {
    // Search all activities
    const activities = await this.activityModel
      .find()
      .select(['_id', 'name', 'code'])
      .lean();
    const activityIds = activities.map((activity) => activity._id);

    // Fetch all assessments by status
    const assessments = await this.assessmentModel
      .find({
        status: AssessmentStatus.activity,
        activity: { $in: activityIds },
      })
      .lean();
    const assessmentsMap = new Map(
      assessments.map((assessment) => [assessment._id.toString(), assessment]),
    );

    // Prepare table values
    // Get users
    const users = await this.userModel
      .find()
      .select(['_id', 'name', 'username', 'major', 'type', 'round', 'password'])
      .populate({
        path: 'major',
        select: '_id name',
        populate: { path: 'school', select: '_id name' },
      })
      .lean();
    const userIds = users.map((user) => user._id);

    // Get activities answers
    const answers = await this.evaluationModel
      .find({ author: { $in: userIds }, activity: { $in: activityIds } })
      .lean();
    const answersMap = new Map(
      answers.map((answer) => [
        `${answer.author.toString()}:${answer.activity.toString()}`,
        answer,
      ]),
    );

    // Merge answers of each activity to the users
    for (const user of users) {
      Object.assign(
        user,
        Object.fromEntries(
          activities.map((activity) => {
            const key = `${user._id.toString()}:${activity._id.toString()}`;
            const answer = answersMap.get(key);
            const data = {};
            if (!answer) {
              data['assessment'] = false;
            } else {
              data['assessment'] = true;
              answer.values.forEach((value) => {
                const assessmentId = value.question.toString();
                const assessment = assessmentsMap.get(assessmentId);
                if (!assessment) return;
                switch (assessment.type) {
                  case AssessmentType.ratings:
                    const number = parseInt(value.value);
                    if (!isNaN(number)) {
                      data[assessmentId] = number;
                    } else {
                      data[assessmentId] = null;
                    }
                    break;
                  case AssessmentType.text:
                    if (typeof value.value === 'string') {
                      data[assessmentId] = value.value;
                    } else {
                      data[assessmentId] = null;
                    }
                }
              });
            }
            return [activity._id.toString(), data];
          }),
        ),
      );
    }

    // Get activities assessments
    const activityAssessmentsObj: Record<
      string,
      (Assessment & { _id: string | Types.ObjectId })[]
    > = Object.fromEntries(activityIds.map((id) => [id, []]));
    for (const assessment of assessments) {
      const activityId = assessment.activity.toString();
      if (activityAssessmentsObj[activityId]) {
        activityAssessmentsObj[activityId].push(assessment);
      }
    }

    // Map activities with headers
    const activitiesWithHeaders = activities.map((activity) => {
      const activityId = activity._id.toString();
      const assessments = activityAssessmentsObj[activityId];
      const headers = assessments.map((assessment) => {
        const assessmentId = assessment._id.toString();
        const header = {
          title: assessment.question.en,
          value: `${activityId}.${assessmentId}`,
        };
        if (assessment.type === AssessmentType.ratings) {
          header['average'] = users
            .filter((user) => user[activityId][assessmentId])
            .reduce((acc, curr, i) => {
              const value = curr[activityId][assessmentId];
              if (i === 0) return value;
              return (acc + value) / 2;
            }, 0);
        }
        return header;
      });
      return { ...activity, headers };
    });
    return {
      activities: activitiesWithHeaders,
      values: users.map(({ password, ...user }) => ({
        ...user,
        isLoggedIn: !!password,
      })),
    };
  }
}
