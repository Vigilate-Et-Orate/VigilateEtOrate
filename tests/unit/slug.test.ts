import { buildSlug } from '../../utils/slug/slugBuilder'

test('Slug Build Test - Normal', () => {
  expect(buildSlug('Exemple de priere')).toBe('exemple-de-priere')
})
