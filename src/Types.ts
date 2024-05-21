export type UserRegistry = {
    email: string,
    first_name: string,
    last_name: string,
    password: string
}

export type UserLogin = {
    email: string,
    password: string
}

export type UserProfile = {
    email: string,
    first_name: string,
    last_name: string,
    disabled: boolean
}

export type ImageWithNames = {
    url: string,
    names: Array<string>,
    created_at: string,
}

export type ImagesList = {
    items: Array<ImageWithNames>
}

export type GalleryType = {
    id: string,
    name: string,
    description: string | null,
    url: string
}

export type GalleriesList = {
    items: Array<GalleryType>
}
