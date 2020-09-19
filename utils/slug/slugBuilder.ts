export const buildSlug = (title: string) => {
  let slug = title.toLowerCase()
  slug = slug.split(' ').join('-')
  return slug
}
