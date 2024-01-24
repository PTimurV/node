export type BookViewModel = {
    id: number
    title: string
    author : string
    publicationYear : number
    isAvailable : boolean
    borrower : string|null
    dueDate: string|null
}