import { Service } from 'egg';

export default class PaperService extends Service {
  /**
   * @param query
   */
  public async addQuestion(query: any) {
    const { ctx } = this;
    return await ctx.model.Question.create(query);
  }
}