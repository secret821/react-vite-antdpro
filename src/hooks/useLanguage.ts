import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function useLanguage() {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)

  useEffect(() => {
    setLanguage(i18n.language)
  }, [i18n.language])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
    setLanguage(lng)
  }

  return {
    language,
    changeLanguage,
  }
}

