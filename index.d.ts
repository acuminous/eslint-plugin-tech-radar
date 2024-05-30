import { Rule, Linter } from 'eslint';

export declare const parseForESLint: (text: string, options?: any) => Linter.ESLintParseResult;
export declare const rules: Record<string, Rule.RuleModule>;
