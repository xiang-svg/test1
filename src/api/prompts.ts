export function buildRewritePrompt(personalityTrait: string): string {
  return (
    personalityTrait +
    '\n\n请用你的人格风格改写下面这句话。' +
    '只输出改写后的句子，不要加引号、不要解释、不要多余内容。' +
    '保持改写后的句子在50字以内。'
  );
}

export function buildScorePrompt(): string {
  return (
    '你是一个语义相似度评分器。比较两句话的语义相似度，返回0-100的整数分数。' +
    '100表示完全相同的意思，0表示完全无关。' +
    '以JSON格式返回：{"score": 数字}'
  );
}
