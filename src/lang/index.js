import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
// Site languages
import azLocale from './az'
import ruLocale from './ru'
import enLocale from './en'
import trLocale from './tr'

// Element ui languages
import elementAzLocale from '@/lang/elementAz' // lang i18n
import elementRuLocale from 'element-ui/lib/locale/lang/ru-RU'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementTrLocale from 'element-ui/lib/locale/lang/tr-TR'

Vue.use(VueI18n)
const messages = {
  az: {
    ...azLocale,
    ...elementAzLocale
  },
  ru: {
    ...ruLocale,
    ...elementRuLocale
  },
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  tr: {
    ...trLocale,
    ...elementTrLocale
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) {
    return chooseLanguage
  } else {
    return 'az'
  }
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

export default i18n
