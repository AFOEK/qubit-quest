import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { format } from 'prettier';

const result = await build({
  stdin: {
    contents:
      "export {courses} from './apps/web/src/curriculum.ts'; export {learningPaths} from './apps/web/src/learning-paths.ts';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  logLevel: 'silent',
});
const { courses, learningPaths } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);
const data = {
  courses: courses.map((course) => ({
    id: course.id,
    title: course.title,
    prerequisites: course.prerequisites,
    lessons: course.lessons.map((lesson) => ({ id: lesson.id, correct: lesson.correct })),
  })),
  paths: learningPaths,
};
const file = 'shared/learning-manifest.json';
const text = await format(JSON.stringify(data), { parser: 'json', printWidth: 100 });
if (process.argv.includes('--check')) {
  if (readFileSync(file, 'utf8') !== text) {
    console.error('Learning manifest is out of date. Run npm run learning:sync.');
    process.exit(1);
  }
} else {
  mkdirSync('shared', { recursive: true });
  writeFileSync(file, text);
}
