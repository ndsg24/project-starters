export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Dependabot genera tablas y enlaces largos en el cuerpo de sus commits.
    'body-max-line-length': [0, 'always', 100],
  },
}
