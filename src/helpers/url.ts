export const GetFileUrl = (
    url: string,
    namefile: string,
    paths: string[] = []
) => {
    let path = '/'
    for (const folder of paths) {
        path += folder + '/'
    }
    return url + path + namefile
}
