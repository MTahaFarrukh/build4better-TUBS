export const PRACTICE_PHOTOS = [
  {
    id: 'rooftop-chai',
    caption: 'Evening chai on the rooftop',
    captionUr: 'چھت پر شام کی چائے',
    src: '/gallery/rooftop-chai.svg',
  },
  {
    id: 'garden-flowers',
    caption: 'Flowers from Ammi’s garden',
    captionUr: 'امی کے باغ کے پھول',
    src: '/gallery/garden-flowers.svg',
  },
  {
    id: 'mountain-dawn',
    caption: 'Northern hills at dawn',
    captionUr: 'شمال کی پہاڑیاں، صبح سویرے',
    src: '/gallery/mountain-dawn.svg',
  },
  {
    id: 'kite-sky',
    caption: 'Basant kite in the sky',
    captionUr: 'آسمان میں بسنت کی پتنگ',
    src: '/gallery/kite-sky.svg',
  },
  {
    id: 'festive-lights',
    caption: 'Festive lights at home',
    captionUr: 'گھر کی خوشی کی روشنیاں',
    src: '/gallery/festive-lights.svg',
  },
  {
    id: 'picnic-park',
    caption: 'Family picnic in the park',
    captionUr: 'پارک میں خاندانی پکنک',
    src: '/gallery/picnic-park.svg',
  },
]

export const PRACTICE_CONTACTS = [
  { id: 'ammi', name: 'Ammi', initials: 'ام', color: '#167D68' },
  { id: 'abu', name: 'Abu', initials: 'اب', color: '#183B35' },
  { id: 'beti', name: 'Beti', initials: 'بے', color: '#2A524A' },
  { id: 'family-group', name: 'Family Group', initials: 'FG', color: '#4F6F68' },
]

export function getPhotoById(id) {
  return PRACTICE_PHOTOS.find((photo) => photo.id === id) ?? null
}

export function getContactById(id) {
  return PRACTICE_CONTACTS.find((contact) => contact.id === id) ?? null
}
