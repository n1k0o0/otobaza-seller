import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Otobaza Seller'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
