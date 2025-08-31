export type Theme = 'dark' | 'light'

export const themes = {
  dark: {
    name: 'Midnight Scholar',
    variables: {
      '--background': '#0a0a0b',
      '--surface': '#1a1a1c',
      '--card': '#2a2a2e',
      '--accent': '#f5c842',
      '--secondary': '#e67e22',
      '--success': '#27ae60',
      '--warning': '#f39c12',
      '--danger': '#e74c3c',
      '--text-primary': '#ffffff',
      '--text-secondary': '#a0a0a0',
      '--border': '#3a3a3e',
    }
  },
  light: {
    name: 'Metallic Luxe',
    variables: {
      '--background': '#f8f9fa',
      '--surface': '#ffffff',
      '--card': '#f1f3f4',
      '--accent': '#d4a574',
      '--secondary': '#8b7355',
      '--success': '#2e7d32',
      '--warning': '#f57c00',
      '--danger': '#d32f2f',
      '--text-primary': '#1a1a1c',
      '--text-secondary': '#5f6368',
      '--border': '#dadce0',
    }
  }
}

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  const themeConfig = themes[theme]
  
  Object.entries(themeConfig.variables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  root.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem('theme') as Theme) || 'dark'
}
