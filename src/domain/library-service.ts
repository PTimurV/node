
import {BookType} from "../repositories/dbMongo-library";
import {booksRepository} from "../repositories/books-db-repository";
import {getBookViewModel} from "../routes/router-library";



export const libraryService= {
    
    
    async createBook( title: string,author : string,publicationYear : number,
                      isAvailable : boolean):Promise<BookType>  {
        let createBook: BookType
    if (isAvailable){
         createBook= {
            id: +(new Date()),
            title: title,
            author : author,
            publicationYear : publicationYear,
            isAvailable : isAvailable,
            borrower : null,
            dueDate: null,
    
        };
    }
    else {
         createBook = {
            id: +(new Date()),
            title: title,
            author : author,
            publicationYear : publicationYear,
            isAvailable : true,
            borrower : null,
            dueDate: null,

        };
    }
        

        const createdBook =  await booksRepository.createBook(createBook);

        return getBookViewModel(createdBook)

    },

    async borrowBook(id: number, borrower: string, dueDate: string)  {
        
        

        return await booksRepository.borrowBook(id, borrower,dueDate)
    },
    
    async returnBook(id: number)  {



        return await booksRepository.returnBook(id)
    }
}