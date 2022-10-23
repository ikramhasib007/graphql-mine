import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
const fullConfig = resolveConfig(tailwindConfig)

export const reactSelectTheme = theme => ({
  ...theme,
  borderRadius: fullConfig.theme.spacing[1.5],
  borderColor: fullConfig.theme.colors.gray[300],
  colors: {
    ...theme.colors,
    primary25: fullConfig.theme.colors.neutral[100],
    primary: fullConfig.theme.colors.neutral[500],
  },
})

export const createOption = (label) => ({
  label,
  value: label,
  __isNew__: true
});