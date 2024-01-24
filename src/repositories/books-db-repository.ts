import {BookType, booksCollection} from "./dbMongo-library";


export const booksRepository= {
    
    async createBook(newBook: BookType): Promise<BookType> {


        const result = await booksCollection.insertOne(newBook)

        return newBook

    },
    
    async findBooks(title: string|null|undefined,author: string|null|undefined,sortField: string,sortOrder: string): Promise<BookType[]> {

        const filter: any = {}


        if (title){
            filter.title = { $regex: title}
        }
        if (author){
            filter.author = { $regex: author}
        }
        

        if (sortField)
        {
            return booksCollection.find(filter, {projection:{_id:0}})
                .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
                .toArray()
        }
        
        else {
            return booksCollection.find(filter, {projection:{_id:0}}).toArray()
        }
        
        
        

    },
    
    async getBookById(id: number): Promise<BookType|null> {
        return await booksCollection.findOne({id: id})
    },

    async borrowBook(id: number , borrower: string, dueDate: string): Promise<boolean> {

        const book = await booksCollection.findOne({id: id, isAvailable: true});

        if (!book) {
            return false;
        }

        const result = await booksCollection.updateOne({id: id}, {
            $set: {
                isAvailable: false,
                borrower: borrower,
                dueDate: dueDate
            }
        })
        return result.matchedCount === 1
    },

    async returnBook(id: number): Promise<boolean> {

        const book = await booksCollection.findOne({ id: id, isAvailable: false, borrower: { $ne: null }, dueDate: { $ne: null } });

        if (!book) {
            return false;
        }


        const result = await booksCollection.updateOne({id: id},{$set:{borrower: null, dueDate:null, isAvailable: true}})
        return result.matchedCount===1
    }
}
