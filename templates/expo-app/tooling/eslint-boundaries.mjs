import path from 'node:path'

const ranks = { shared: 0, features: 1, widgets: 2, modules: 3, app: 4 }
export default {
  rules: {
    boundaries: {
      meta: { type: 'problem', schema: [], messages: { boundary: '{{reason}}' } },
      create(context) {
        const filename = context.filename.replaceAll('\\', '/')
        const sourceRoot = filename.slice(0, filename.lastIndexOf('/src/') + 5)
        if (!filename.includes('/src/')) return {}
        const sourceParts = filename.slice(sourceRoot.length).split('/')
        function inspect(node) {
          const specifier = node.source?.value
          if (typeof specifier !== 'string') return
          const target = specifier.startsWith('@/')
            ? path.join(sourceRoot, specifier.slice(2))
            : specifier.startsWith('.')
              ? path.resolve(path.dirname(filename), specifier)
              : null
          const targetParts = target?.replaceAll('\\', '/').slice(sourceRoot.length).split('/')
          let reason
          if (sourceParts.includes('domain') || sourceParts.includes('use-cases')) {
            if (
              !target ||
              !target.startsWith(sourceRoot) ||
              targetParts.includes('infrastructure') ||
              targetParts.some((part) => /\.(handler|module|query|command)\./.test(part))
            ) {
              reason =
                'Domain and use cases must remain pure and independent of frameworks and infrastructure.'
            }
          }
          if (target && targetParts && sourceParts[0] in ranks && targetParts[0] in ranks) {
            if (ranks[targetParts[0]] > ranks[sourceParts[0]])
              reason = 'FSD dependencies must point to lower layers.'
            if (
              sourceParts[0] === targetParts[0] &&
              ['features', 'modules', 'widgets'].includes(sourceParts[0]) &&
              sourceParts[1] !== targetParts[1]
            )
              reason = 'Sibling slices must not import one another.'
            if (
              sourceParts[0] !== targetParts[0] &&
              targetParts[0] !== 'app' &&
              targetParts.length > 2 &&
              !/^index(\.[cm]?[jt]sx?)?$/.test(targetParts[2])
            )
              reason = 'Consume each slice through its public index.'
          }
          if (reason) context.report({ node, messageId: 'boundary', data: { reason } })
        }
        return {
          ImportDeclaration: inspect,
          ExportNamedDeclaration: inspect,
          ExportAllDeclaration: inspect,
        }
      },
    },
  },
}
