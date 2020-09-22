export const buildSlug = (title: string): string => {
  let slug = title.toLowerCase()
  slug = slug.split(' ').join('-')
  return slug
}
