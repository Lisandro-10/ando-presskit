export const PRESSKIT_QUERY = `{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    heroTagline,
    heroImage,
    biographyColumn1[]{text, emphasis},
    biographyColumn2[]{text, emphasis},
    socials,
    directEmail
  },
  "photos": *[_type == "photo"] | order(orderRank){
    _id,
    image,
    title,
    description
  },
  "videos": *[_type == "video"] | order(orderRank){
    _id,
    "src": file.asset->url,
    orientation,
    "poster": poster.asset->url
  },
  "liveSets": *[_type == "liveSet"] | order(orderRank){
    _id,
    title,
    trackUrl,
    description
  },
  "contacts": *[_type == "contact"] | order(orderRank){
    _id,
    name,
    email,
    phone,
    instagram
  }
}`
