import slugify from 'slugify'

export const getSlug = (str: string) => {
    return slugify(str).toLowerCase()
}
