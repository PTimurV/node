export type CreateBookModel ={
    /**
     * Course title
     */
    title: string
    author : string
    publicationYear : number
    isAvailable : boolean
    borrower : string
    dueDate: string
}